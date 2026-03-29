// src/hooks/useRanking.js
// ================================================================
// Este hook gestiona todo lo relacionado con el Ranking:
// - Ordenar los usuarios por puntos
// - Calcular la posicion del usuario actual
// - Mostrar/ocultar el ranking completo
// - Llamar al AI Mentor para pedir consejos
// ================================================================

import { useState, useMemo } from "react";
import { callGemini } from "../api/gemini";
import { CURRENT_USER_ID } from "../constants";

export function useRanking(rankingData) {
  const [showAllRanking, setShowAllRanking] = useState(false);
  const [mentorResponse, setMentorResponse] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // useMemo recalcula sortedRanking solo cuando cambia rankingData
  const sortedRanking = useMemo(() => {
    return [...rankingData]
      .sort((a, b) => b.points - a.points)
      .map((user, index) => ({ ...user, position: index + 1 }));
  }, [rankingData]);

  const myIndex = sortedRanking.findIndex(u => u.id === CURRENT_USER_ID);
  const podiumUsers = sortedRanking.slice(0, 3);

  const getDisplayRanking = () => {
    if (showAllRanking) return sortedRanking;
    const start = Math.max(0, myIndex - 2);
    const end = Math.min(sortedRanking.length, myIndex + 3);
    return sortedRanking.slice(start, end);
  };

  const askMentor = async () => {
    if (myIndex < 0) return;
    setIsAiLoading(true);
    const myUser = sortedRanking[myIndex];
    const res = await callGemini(
      `Soy ${myUser.name} y estoy en la posicion #${myUser.position} del ranking con ${myUser.points} XP.
       Dame 2 o 3 consejos concretos y accionables para subir posiciones en el ranking de adopcion de IA.`,
      `Eres el AI Mentor de Randstad Digital. Tu objetivo es motivar y guiar a los empleados
       para que adopten la IA Generativa en su trabajo diario. Se concreto, positivo y breve.`
    );
    setMentorResponse(res);
    setIsAiLoading(false);
  };

  return {
    sortedRanking,
    myIndex,
    podiumUsers,
    getDisplayRanking,
    showAllRanking,
    setShowAllRanking,
    askMentor,
    isAiLoading,
    mentorResponse,
  };
}
