// src/hooks/useForum.js
// ================================================================
// Este hook gestiona todo lo relacionado con el Foro:
// - Lista de hilos y su estado (likes, respuestas)
// - Filtro de categoria activo
// - Hilo seleccionado para ver en detalle
// - Modal de nuevo hilo
// ================================================================

import { useState } from "react";
import { likeThread as likeThreadFn } from "../utils/likeThread";
import { CURRENT_USER_ID } from "../constants";

export function useForum(initialThreads) {
  const [threads, setThreads] = useState(initialThreads);
  const [forumCategory, setForumCategory] = useState("trending");
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [showAddThreadModal, setShowAddThreadModal] = useState(false);

  const handleLike = (threadId) => {
    setThreads(prev => likeThreadFn(prev, threadId, CURRENT_USER_ID));
  };

  const addThread = (newThread) => {
    const thread = {
      id: Date.now(),
      title: newThread.title,
      body: newThread.body,
      user: CURRENT_USER_ID,
      avatar: CURRENT_USER_ID,
      category: newThread.category || "GENERAL",
      likes: 0,
      comments: 0,
      date: "AHORA",
      likedBy: [],
      replies: [],
    };
    setThreads(prev => [thread, ...prev]);
    setShowAddThreadModal(false);
  };

  return {
    threads,
    forumCategory,
    setForumCategory,
    selectedThreadId,
    setSelectedThreadId,
    showAddThreadModal,
    setShowAddThreadModal,
    handleLike,
    addThread,
  };
}
