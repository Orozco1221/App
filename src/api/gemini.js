// src/api/gemini.js
// Aquí gestionamos toda la conexión con la IA de forma segura y centralizada.

const MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
// En el futuro, esta key vendrá de un archivo .env oculto
const apiKey = ""; 

export const callGemini = async (prompt, systemInstruction = "", retries = 0) => {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined
      })
    });
    
    if (!response.ok) throw new Error('API Error');
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text;
    
  } catch (err) {
    if (retries < 5) {
      // Exponential backoff: espera progresiva antes de reintentar
      await new Promise(res => setTimeout(res, Math.pow(2, retries) * 1000));
      return callGemini(prompt, systemInstruction, retries + 1);
    }
    return "Error de conexión con la IA.";
  }
};
