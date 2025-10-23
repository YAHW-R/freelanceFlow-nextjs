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
            You are an intelligent assistant integrated into a project management app for freelancers called "FreelanceFlow."
            Your goal is to help the user analyze, summarize, or find insights into their data.
            Below, I'll provide you with the full context of the user's data in JSON format. Use it to respond to their request.

            **User Data Context:**
            \`\`\`json
            ${JSON.stringify(userData, null, 2)}
            \`\`\`

            **User Prompt:**
            "${prompt}"

            Respond clearly, concisely, and helpfully, based solely on the information provided.
        `;


    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: fullPrompt,
    });

    return response.text

}