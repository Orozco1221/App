// src/utils/likeThread.ts
// ============================================================
// ¿QUÉ ES UNA FUNCIÓN PURA?
// Una función pura es aquella que:
//   1. Dado el mismo estado de entrada, devuelve siempre el mismo resultado.
//   2. No modifica nada fuera de ella misma (no tiene "efectos secundarios").
//
// Esto la hace perfecta para testear: no necesitas React, no necesitas
// montar la app, solo le pasas datos y compruebas el resultado.
// ============================================================

export interface Thread {
  id: number;
  likes: number;
  likedBy: string[];
  [key: string]: unknown;
}

/**
 * Alterna el like de un usuario en un hilo del foro.
 *
 * @param threads       - Lista completa de hilos del foro
 * @param threadId      - ID del hilo al que dar/quitar like
 * @param currentUserId - ID del usuario que hace la acción
 * @returns Nueva lista de hilos con el like actualizado
 */
export function likeThread<T extends Thread>(threads: T[], threadId: number, currentUserId: string): T[] {
  // Recorremos todos los hilos
  return threads.map(thread => {
    // Si no es el hilo que buscamos, lo devolvemos sin cambios
    if (thread.id !== threadId) return thread;

    // Comprobamos si el usuario ya ha dado like
    const hasLiked = thread.likedBy.includes(currentUserId);

    if (hasLiked) {
      // Ya tenía like → lo quitamos
      return {
        ...thread,
        likes: thread.likes - 1,
        likedBy: thread.likedBy.filter(uid => uid !== currentUserId),
      };
    } else {
      // No tenía like → lo añadimos
      return {
        ...thread,
        likes: thread.likes + 1,
        likedBy: [...thread.likedBy, currentUserId],
      };
    }
  });
}
