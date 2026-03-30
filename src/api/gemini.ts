// src/api/gemini.ts — refactorizado PR #1
import { GEMINI_MODEL_NAME, GEMINI_MAX_RETRIES } from '../constants';

const apiKey = process.env.REACT_APP_GEMINI_KEY ?? "";

export const callGemini = async (
  prompt: string,
  systemInstruction: string = "",
  retries: number = 0
): Promise<string> => {
  if (!apiKey) {
    console.warn("[callGemini] Define REACT_APP_GEMINI_KEY en tu .env");
    return "Error: API key no configurada.";
  }
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL_NAME}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
        }),
      }
    );
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  } catch (err) {
    if (retries < GEMINI_MAX_RETRIES) {
      await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
      return callGemini(prompt, systemInstruction, retries + 1);
    }
    return "Error de conexión con la IA.";
  }
};
