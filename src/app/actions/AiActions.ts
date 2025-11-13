'use server'

import { createClient } from '@/lib/supabase/server'; // Tu cliente de Supabase
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function chatWithGemini(userQuery: string) {
    const supabase = await createClient();

    // 1. Autenticación (Vital para crear registros)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Debes iniciar sesión.' };

    // ... (Aquí iría tu lógica de Rate Limiting de la respuesta anterior) ...

    // 2. Obtener contexto mínimo (para que la IA sepa a qué proyecto asignar la tarea si el usuario dice "en el proyecto web")
    const { data: projects } = await supabase.from('projects').select('id, name').eq('user_id', user.id);

    // 3. Definir el "System Prompt" con instrucciones estrictas de JSON
    const systemPrompt = `
    Eres un asistente de gestión de proyectos. Tienes acceso a estos proyectos del usuario: ${JSON.stringify(projects)}.

    TU OBJETIVO:
    Analiza si el usuario quiere CHATEAR o EJECUTAR UNA ACCIÓN (Crear tarea, proyecto, cliente).
    
    IMPORTANTE:
    Si el usuario quiere crear algo, DEBES responder SOLO con un objeto JSON estrictamente válido dentro de un bloque de código json. No añadas texto extra fuera del JSON.
    
    FORMATOS DE JSON ESPERADOS:

    A) Para crear TAREA:
    \`\`\`json
    {
      "intent": "create_task",
      "data": {
        "title": "Título de la tarea",
        "project_id": "ID del proyecto (si se menciona uno existente, si no null)",
        "priority": "low" | "medium" | "high" (inferido o default medium)
      },
      "response_text": "He creado la tarea..."
    }
    \`\`\`

    B) Para crear PROYECTO:
    \`\`\`json
    {
      "intent": "create_project",
      "data": { "name": "Nombre del proyecto", "status": "active" },
      "response_text": "Proyecto creado con éxito..."
    }
    \`\`\`

    C) Si es solo conversación:
    \`\`\`json
    {
      "intent": "chat",
      "response_text": "Tu respuesta normal aquí..."
    }
    \`\`\`
  `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Flash es perfecto para esto

        const result = await model.generateContent([
            systemPrompt,
            `Usuario: ${userQuery}`
        ]);

        const rawText = result.response.text();

        // 4. Limpieza y Parseo del JSON
        // A veces la IA pone ```json al principio y ``` al final. Lo limpiamos.
        const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

        let aiResponse;
        try {
            aiResponse = JSON.parse(cleanJson);
        } catch {
            // Si falla el parseo, asumimos que fue una respuesta de texto normal
            return { success: true, data: rawText };
        }

        // 5. Ejecutar Acciones en Supabase según el "intent"
        if (aiResponse.intent === 'create_task') {

            const { error } = await supabase.from('tasks').insert({
                user_id: user.id,
                title: aiResponse.data.title,
                project_id: aiResponse.data.project_id,
                priority: aiResponse.data.priority || 'medium',
                status: 'todo'
            });

            if (error) return { success: true, data: `❌ Error creando tarea: ${error.message}` };
            return { success: true, data: `✅ ${aiResponse.response_text}` };

        } else if (aiResponse.intent === 'create_project') {

            const { error } = await supabase.from('projects').insert({
                user_id: user.id,
                name: aiResponse.data.name,
                status: 'active'
            });

            if (error) return { success: true, data: `❌ Error creando proyecto: ${error.message}` };
            return { success: true, data: `✅ ${aiResponse.response_text}` };

        } else {
            // Es solo chat normal
            return { success: true, data: aiResponse.response_text };
        }

    } catch (error) {
        console.error('Error AI:', error);
        return { error: 'Error procesando la solicitud.' };
    }
}