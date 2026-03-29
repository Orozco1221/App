// src/utils/parseEvaluation.js
// ============================================================
// ¿POR QUÉ EXTRAER ESTA FUNCIÓN?
// En App.js teníamos este código dentro de evaluateChallenge():
//
//   try { setEvaluation(JSON.parse(res.replace(/```json|```/g, "").trim())); }
//   catch (e) { setEvaluation({ score: 3, feedback: "Evaluación completada." }); }
//
// El problema: ese código estaba mezclado con el estado de React,
// así que era imposible testarlo de forma aislada.
//
// Ahora lo extraemos como función pura: recibe un string,
// devuelve un objeto. Fácil de testear, fácil de reutilizar.
// ============================================================

/**
 * Parsea la respuesta de texto de Gemini y devuelve una evaluación.
 *
 * @param {string} rawResponse - Texto crudo que devuelve Gemini
 * @returns {{ score: number, feedback: string }} Evaluación parseada
 */
export function parseEvaluation(rawResponse) {
  // Valor por defecto si algo falla
  const FALLBACK = { score: 3, feedback: "Evaluación completada." };

  // Si no hay respuesta, devolvemos el fallback
  if (!rawResponse || typeof rawResponse !== "string") return FALLBACK;

  try {
    // Gemini a veces envuelve el JSON en bloques de markdown:
    //   ```json
    //   { "score": 4, "feedback": "Muy bien" }
    //   ```
    // El .replace() elimina esas marcas antes de parsear.
    const clean = rawResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // Validamos que el score sea un número entre 0 y 5
    const score = typeof parsed.score === "number"
      ? Math.min(5, Math.max(0, parsed.score))  // lo forzamos al rango 0-5
      : FALLBACK.score;

    const feedback = typeof parsed.feedback === "string" && parsed.feedback.trim()
      ? parsed.feedback
      : FALLBACK.feedback;

    return { score, feedback };

  } catch {
    // Si el JSON está mal formado, devolvemos el fallback
    return FALLBACK;
  }
}
