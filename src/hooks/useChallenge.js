// src/hooks/useChallenge.js
// ================================================================
// QUE ES UN HOOK CUSTOM?
// Un hook es una funcion de React que empieza por "use" y puede
// tener su propio estado interno con useState.
//
// Por que lo creamos?
// Antes toda la logica de los retos vivia dentro de App.js mezclada
// con el resto de la app. Ahora vive aqui, aislada y testeable.
//
// Como funciona:
// App.js llama a useChallenge() y recibe un objeto con todo lo
// que necesita: el estado actual y las funciones para cambiarlo.
// ================================================================

import { useState } from "react";
import { callGemini } from "../api/gemini";
import { parseEvaluation } from "../utils/parseEvaluation";

export function useChallenge() {
  const [submissionText, setSubmissionText] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const evaluateChallenge = async () => {
    if (!submissionText.trim()) return;

    setIsEvaluating(true);

    const res = await callGemini(
      `Evalua este prompt de un usuario de Randstad Digital: "${submissionText}"`,
      `Eres un Juez Senior de Randstad Digital especializado en IA Generativa.
       Evalua la calidad, claridad y efectividad del prompt enviado.
       Responde UNICAMENTE con un JSON valido con este formato exacto, sin texto adicional:
       {"score": <numero entero entre 0 y 5>, "feedback": "<frase de feedback constructivo en espanol>"}`
    );

    setEvaluation(parseEvaluation(res));
    setIsEvaluating(false);
  };

  return {
    submissionText,
    setSubmissionText,
    evaluation,
    setEvaluation,
    isEvaluating,
    evaluateChallenge,
  };
}
