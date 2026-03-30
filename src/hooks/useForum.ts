// src/hooks/useForum.ts
// ================================================================
// Este hook gestiona todo lo relacionado con el Foro:
// - Lista de hilos y su estado (likes, respuestas)
// - Filtro de categoria activo
// - Hilo seleccionado para ver en detalle
// - Modal de nuevo hilo
// ================================================================

import { useState } from "react";
import { likeThread as likeThreadFn } from "../utils/likeThread";
import type { ForumThread } from "../data/mockData";
import { CURRENT_USER_ID } from "../constants";

export interface NewThreadInput {
  title: string;
  body: string;
  category?: string;
}

export interface UseForumReturn {
  threads: ForumThread[];
  forumCategory: string;
  setForumCategory: (cat: string) => void;
  selectedThreadId: number | null;
  setSelectedThreadId: (id: number | null) => void;
  showAddThreadModal: boolean;
  setShowAddThreadModal: (show: boolean) => void;
  handleLike: (threadId: number) => void;
  addThread: (newThread: NewThreadInput) => void;
}

export function useForum(initialThreads: ForumThread[]): UseForumReturn {
  const [threads, setThreads] = useState<ForumThread[]>(initialThreads);
  const [forumCategory, setForumCategory] = useState("trending");
  const [selectedThreadId, setSelectedThreadId] = useState<number | null>(null);
  const [showAddThreadModal, setShowAddThreadModal] = useState(false);

  const handleLike = (threadId: number) => {
    setThreads(prev => likeThreadFn(prev, threadId, CURRENT_USER_ID));
  };

  const addThread = (newThread: NewThreadInput) => {
    const thread: ForumThread = {
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
