import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    console.warn("API_KEY is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const generateAiResponse = async (
  userQuery: string, 
  history: {role: string, parts: {text: string}[]}[] = []
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "I'm sorry, I cannot connect to the university servers right now (Missing API Key).";

  try {
    const model = 'gemini-3-flash-preview'; 
    // Using a fast model for chat responsiveness
    
    // We are simulating a chat with history context
    // Ideally we would use ai.chats.create but for a simple stateless helper function 
    // in this architecture, we will just use generateContent with a system instruction.
    
    const response = await ai.models.generateContent({
      model: model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: userQuery }] }
      ],
      config: {
        systemInstruction: "You are 'UniBot', a helpful, friendly, and knowledgeable university AI assistant. You help students with academic queries, club information, and general campus life advice. Keep answers concise and encouraging. If asked about specific dates or private user data, politely explain you are a demo assistant.",
      }
    });

    return response.text || "I didn't catch that. Could you rephrase?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I'm having trouble processing your request right now.";
  }
};

export const summarizePost = async (postContent: string): Promise<string> => {
    const ai = getAiClient();
    if (!ai) return "";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Summarize this university announcement in one short, catchy sentence suitable for a notification: ${postContent}`,
        });
        return response.text || "";
    } catch (e) {
        return "";
    }
}