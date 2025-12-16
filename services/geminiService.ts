import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

// Initialize the client. 
// Note: process.env.API_KEY is assumed to be available in the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are the "Guitar Choir Maestro", an expert AI assistant for a guitar ensemble repository. 
Your knowledge spans music theory, classical guitar techniques, ensemble arrangement, and guitar history.
You help users analyze pieces, suggest practice routines, and understand harmonic structures.
Keep your tone encouraging, professional, and musical.
If asked about the repository content, assume you have access to a standard library of classical and contemporary guitar ensemble music.`;

/**
 * Creates a new chat session with the specific system instruction.
 */
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

/**
 * Sends a message to the chat session and returns the response text.
 */
export const sendMessageToGemini = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I played a rest... (No response generated)";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("The Maestro is currently tuning. Please try again later.");
  }
};

/**
 * Generates Lyrics for a song.
 */
export const generateLyrics = async (songTitle: string): Promise<string> => {
  try {
    const prompt = `Generate the full lyrics for the song "${songTitle}". 
    If the song is a known Christian hymn or popular worship song (especially one performed by MFM Guitar Choir), provide the accurate original lyrics.
    If the song is ambiguous or unknown, compose creative, biblically-inspired worship lyrics fitting for a guitar choir.
    Format the output clearly with headers like "Verse 1", "Chorus", "Bridge". 
    Do NOT include chord charts or sheet music, just the lyrics.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Could not generate lyrics.";
  } catch (error) {
    console.error("Generation Error:", error);
    throw new Error("Failed to generate lyrics.");
  }
};