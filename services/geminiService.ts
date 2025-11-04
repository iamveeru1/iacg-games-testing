import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might have better error handling or a fallback.
  // For this context, we'll log an error.
  console.error("Gemini API key not found. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export interface WordChallengeResponse {
    originalWord: string;
    scrambledWord: string;
    hint: string;
}

export const generateWordChallenge = async (category: string, difficulty: 'easy' | 'medium' | 'hard'): Promise<WordChallengeResponse | null> => {
    const wordLength = difficulty === 'easy' ? '4-5 letters' : difficulty === 'medium' ? '6-8 letters' : '9-12 letters';
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Generate a single common English word related to the category "${category}". The word should be ${wordLength} long. Provide the word, a scrambled version of it, and a short definition or hint for the word.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        originalWord: {
                            type: Type.STRING,
                            description: "The original, unscrambled word."
                        },
                        scrambledWord: {
                            type: Type.STRING,
                            description: "The scrambled version of the original word."
                        },
                        hint: {
                            type: Type.STRING,
                            description: "A short definition or hint for the word."
                        }
                    },
                    required: ["originalWord", "scrambledWord", "hint"]
                }
            }
        });

        const jsonText = response.text.trim();
        const data: WordChallengeResponse = JSON.parse(jsonText);
        
        // Basic validation
        if(data.originalWord && data.scrambledWord && data.hint) {
            return data;
        }
        return null;

    } catch (error) {
        console.error("Error generating word challenge with Gemini:", error);
        // Fallback for demo purposes if API fails
        const fallbacks: { [key: string]: WordChallengeResponse } = {
            animals: { originalWord: 'TIGER', scrambledWord: 'GITER', hint: 'Large feline predator' },
            fruits: { originalWord: 'APPLE', scrambledWord: 'PAPEL', hint: 'A common red or green fruit' },
            countries: { originalWord: 'JAPAN', scrambledWord: 'NAJAP', hint: 'An island nation in East Asia' }
        };
        const fallbackCategory = category in fallbacks ? category : 'animals';
        return fallbacks[fallbackCategory];
    }
};
