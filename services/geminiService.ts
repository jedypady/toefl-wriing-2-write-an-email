import { GoogleGenAI, Type } from "@google/genai";
import type { ScoreResult, WritingPromptContent } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const scoreSchema = {
    type: Type.OBJECT,
    properties: {
        score: {
            type: Type.INTEGER,
            description: "The holistic score for the email, as an integer from 0 to 5, based on the provided scoring guide."
        },
        explanation: {
            type: Type.STRING,
            description: "A detailed, constructive explanation for the score provided. This explanation should reference specific criteria from the scoring guide (e.g., 'syntactic variety', 'social conventions', 'elaboration') and provide examples from the user's email to support the evaluation."
        }
    },
    required: ["score", "explanation"]
};

const promptSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "A short, engaging title for the writing task. For example: 'Email to a University Professor'."
        },
        scenario: {
            type: Type.STRING,
            description: "A detailed, self-contained scenario describing the context for the email. This should be unique and not reference any previous scenarios."
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3 to 4 specific instructions or bullet points the user must include in their email."
        },
        footer: {
            type: Type.STRING,
            description: "A short footer text. This should always be 'You have 7 minutes to write your email.'"
        }
    },
    required: ["title", "scenario", "instructions", "footer"]
};


export const scoreEmail = async (emailText: string, scoringGuide: string): Promise<ScoreResult> => {
    
    const prompt = `
    You are an expert evaluator for an English language assessment. Your task is to score an email written by a test-taker based on the provided scoring guide.

    **SCORING GUIDE:**
    ---
    ${scoringGuide}
    ---

    **EMAIL TO EVALUATE:**
    ---
    ${emailText}
    ---

    **INSTRUCTIONS:**
    1.  Carefully read and analyze the "EMAIL TO EVALUATE".
    2.  Compare the email's quality against the criteria described in the "SCORING GUIDE".
    3.  Assign a single, holistic score from 0 to 5.
    4.  Write a detailed explanation for your score. In your explanation, you must explicitly refer to the criteria in the scoring guide (e.g., "The email demonstrates effective syntactic variety...", "In terms of social conventions...").
    5.  Format your response as a JSON object that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: scoreSchema,
                temperature: 0.2,
            }
        });

        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as ScoreResult;
        
        if (typeof result.score !== 'number' || typeof result.explanation !== 'string') {
            throw new Error("Invalid JSON structure received from API.");
        }
        
        return result;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw new Error("Failed to get a valid response from the AI model.");
    }
};

export const generateWritingPrompt = async (): Promise<WritingPromptContent> => {
    const metaPrompt = `
    You are a creative assistant responsible for generating educational content.
    Your task is to create a new, self-contained scenario for an email writing exercise.
    This exercise is for people practicing their English writing skills.

    **RULES:**
    1.  **Unique Scenarios:** Each scenario you generate must be completely new and unique. Do not repeat or reference any scenarios you might have created before.
    2.  **Self-Contained:** The scenario must provide all the necessary context for the user to write the email.
    3.  **Coherent:** The scenario must be logical and easy to understand.
    4.  **Appropriate Topics:** Choose common, everyday situations (e.g., workplace, academic, customer service, social arrangements). Avoid sensitive or overly complex topics.
    5.  **Fixed Footer:** The 'footer' must always be exactly this string: "You have 7 minutes to write your email."

    Generate a response as a JSON object that matches the provided schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-pro',
            contents: metaPrompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: promptSchema,
                temperature: 0.9,
            }
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText) as WritingPromptContent;
        
        if (typeof result.title !== 'string' || typeof result.scenario !== 'string' || !Array.isArray(result.instructions)) {
            throw new Error("Invalid JSON structure received for writing prompt.");
        }
        
        return result;
    } catch (error) {
        console.error("Error calling Gemini API for prompt generation:", error);
        throw new Error("Failed to generate a new writing prompt.");
    }
};
