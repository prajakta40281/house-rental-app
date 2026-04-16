import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const getVector = async (text: string): Promise<number[]> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-embedding-001" 
    });

    // We use 'any' here as a quick bridge to bypass the strict version check
    // while ensuring the 768 dimension instruction still reaches Google.
    const request: any = {
      content: { 
        role: "user", 
        parts: [{ text }] 
      },
      outputDimensionality: 768, 
    };

    const result = await model.embedContent(request);
    const embedding = result.embedding;

    if (embedding && embedding.values) {
      return embedding.values;
    } else {
      throw new Error("Values missing in Gemini response");
    }
  } catch (error: any) {
    console.error("Gemini Error:", error.message);
    throw new Error(`Embedding failed: ${error.message}`);
  }
};