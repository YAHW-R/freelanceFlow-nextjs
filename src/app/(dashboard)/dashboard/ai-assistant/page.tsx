'use client'

import { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '@/app/actions/AiActions';
import ReactMarkdown from 'react-markdown';

// Definimos la estructura del mensaje
type Message = {
    role: 'user' | 'ai';
    content: string;
};

export default function AiChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Scroll automático al último mensaje
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input;
        setInput('');
        setIsLoading(true);

        // 1. Agregar mensaje del usuario inmediatamente a la UI
        setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

        // 2. Llamar al Server Action
        const result = await chatWithGemini(userMessage);

        // 3. Procesar respuesta
        if (result.error) {
            setMessages((prev) => [...prev, { role: 'ai', content: `⚠️ Error: ${result.error}` }]);
        } else {
            // Aquí recibimos el texto final (ya sea respuesta de chat o confirmación de acción)
            // Asegurarnos de que content siempre sea una cadena (evita undefined)
            setMessages((prev) => [...prev, { role: 'ai', content: result.data ?? '' }]);
        }
        setIsLoading(false);
    };

    return (
        // Contenedor principal: ocupa toda la altura disponible, fondo base
        <div className="flex flex-col h-[85vh] bg-[var(--background)] rounded-xl overflow-hidden shadow-lg border border-[var(--background-secondary)]">

            {/* Header del Chat */}
            <div className="p-4 border-b border-[var(--background-secondary)] bg-[var(--background)] flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                <h2 className="font-semibold text-lg text-[var(--foreground)]">FlowBot AI</h2>
            </div>

            {/* Área de Mensajes (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10 opacity-60">
                        <p>¡Hola! Soy tu asistente.</p>
                        <p className="text-sm">{`Prueba decir: "Crea una tarea para revisar el diseño"`}</p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div
                        key={idx}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user'
                                    ? 'bg-[var(--primary)] text-white rounded-br-none' // Usuario: Color Primario
                                    : 'bg-[var(--background-secondary)] text-[var(--foreground)] rounded-bl-none' // AI: Fondo Secundario
                                }`}
                        >
                            {/* Renderizar Markdown para respuestas ricas de la IA */}
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-[var(--background-secondary)] px-4 py-3 rounded-2xl rounded-bl-none text-sm text-gray-500">
                            <span className="animate-pulse">Procesando solicitud...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Área de Input (Fija abajo) */}
            <div className="p-4 bg-[var(--background)] border-t border-[var(--background-secondary)]">
                <div className="flex gap-2 relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Escribe un mensaje o pide crear una tarea..."
                        className="flex-1 bg-[var(--background-secondary)] text-[var(--foreground)] rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] placeholder-gray-400 transition-all"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="bg-[var(--primary)] hover:bg-[var(--primary-hover)] active:bg-[var(--primary-active)] text-white rounded-full p-3 px-6 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {/* Icono de enviar simple */}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
                <div className="text-xs text-center mt-2 text-gray-400">
                    {/* Pequeño disclaimer o info de uso */}
                    IA potenciada por Gemini • 5 mensajes diarios
                </div>
            </div>
        </div>
    );
}