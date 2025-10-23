'use server'

import { GoogleGenAI, GoogleGenAIOptions } from "@google/genai";
import { getFullData } from "./globalActions";

export const makeRequest = async (prompt: string) => {
    const options: GoogleGenAIOptions = {
        apiKey: process.env.GOOGLE_API_KEY,
    }
    const ai = new GoogleGenAI(options);

    const userData = await getFullData()

    const fullPrompt = `
                You are FreelanceFlow AI Assistant, an expert project manager and business analyst specifically designed to help freelance developers manage their work.
                Your primary goal is to provide insightful analysis, actionable summaries, and clear answers based on the user's provided data context.
                When responding, prioritize clarity, conciseness, and helpfulness. Focus on business-oriented insights relevant to project management, client relations, time tracking, and financial performance for a freelance developer.
                
                **Instructions for Response:**
                -   **Always ground your answers in the provided data.** If a request cannot be answered with the given data, state that gracefully.
                -   **Structure complex answers with Markdown:** Use headings, bullet points, numbered lists, and bold text for readability.
                -   **Be precise with numerical data:** When providing metrics (budgets, hours, progress), use the exact numbers from the data and state the units clearly (e.g., "€15,000", "45.5 horas", "80% de progreso").
                -   **Highlight key takeaways:** If summarizing, point out important trends, potential issues (e.g., "Proyecto X está por encima del presupuesto"), or areas for improvement.
                -   **Avoid conversational filler:** Get straight to the point unless the user's prompt specifically asks for a more elaborate explanation.
                -   **Adopt a professional and helpful tone.**
                
                **User Data Context:**
                \`\`\`json
                ${JSON.stringify(userData, null, 2)}
                \`\`\`
                
                **User's Request:**
                "${prompt}"
                
                Please provide your analysis and response based on the above.
                `;


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
    });

    return response.text

}