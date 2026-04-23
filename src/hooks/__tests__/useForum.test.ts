// src/hooks/__tests__/useForum.test.ts

import { renderHook, act } from "@testing-library/react";
import { useForum } from "../useForum";
import type { ForumThread } from "../../data/mockData";

const THREADS_BASE: ForumThread[] = [
  {
    id: 1,
    title: "Como usar ChatGPT en reclutamiento",
    body: "Aqui mis trucos...",
    user: "AM", avatar: "AM", category: "PRODUCTIVIDAD",
    likes: 15, comments: 2, date: "HOY",
    likedBy: [], replies: [],
  },
  {
    id: 2,
    title: "Prompt engineering avanzado",
    body: "Tecnicas avanzadas...",
    user: "CP", avatar: "CP", category: "HERRAMIENTAS",
    likes: 8, comments: 5, date: "AYER",
    likedBy: ["JP"],
    replies: [],
  },
];

describe("useForum()", () => {

  it("tiene el estado inicial correcto", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    expect(result.current.forumCategory).toBe("trending");
    expect(result.current.selectedThreadId).toBeNull();
    expect(result.current.showAddThreadModal).toBe(false);
    expect(result.current.threads).toHaveLength(THREADS_BASE.length);
  });

  it("setForumCategory actualiza la categoria activa", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => { result.current.setForumCategory("new"); });
    expect(result.current.forumCategory).toBe("new");
    act(() => { result.current.setForumCategory("vistos"); });
    expect(result.current.forumCategory).toBe("vistos");
  });

  it("handleLike anade like si el usuario no habia dado like antes", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => { result.current.handleLike(1); });
    const hilo1 = result.current.threads.find(t => t.id === 1)!;
    expect(hilo1.likes).toBe(16);
    expect(hilo1.likedBy).toContain("JP");
  });

  it("handleLike quita el like si el usuario ya habia dado like", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => { result.current.handleLike(2); });
    const hilo2 = result.current.threads.find(t => t.id === 2)!;
    expect(hilo2.likes).toBe(7);
    expect(hilo2.likedBy).not.toContain("JP");
  });

  it("handleLike solo modifica el hilo con el ID correcto", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => { result.current.handleLike(1); });
    const hilo2 = result.current.threads.find(t => t.id === 2)!;
    expect(hilo2.likes).toBe(8);
  });

  it("handleLike no duplica el ID en likedBy si se llama dos veces", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => { result.current.handleLike(1); });
    act(() => { result.current.handleLike(1); });
    const hilo1 = result.current.threads.find(t => t.id === 1)!;
    const aparicionesJP = hilo1.likedBy.filter(uid => uid === "JP");
    expect(aparicionesJP).toHaveLength(0);
    expect(hilo1.likes).toBe(15);
  });

  it("addThread anade un nuevo hilo al principio de la lista", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => {
      result.current.addThread({
        title: "Nuevo hilo de prueba",
        body: "Contenido del hilo",
        category: "CONSULTORIA",
      });
    });
    expect(result.current.threads).toHaveLength(THREADS_BASE.length + 1);
    const nuevoHilo = result.current.threads[0];
    expect(nuevoHilo.title).toBe("Nuevo hilo de prueba");
    expect(nuevoHilo.category).toBe("CONSULTORIA");
  });

  it("addThread crea el hilo con likedBy vacio y 0 likes", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    act(() => {
      result.current.addThread({ title: "Hilo sin likes", body: "Cuerpo", category: "LEGAL" });
    });
    const nuevoHilo = result.current.threads[0];
    expect(nuevoHilo.likedBy).toEqual([]);
    expect(nuevoHilo.likes).toBe(0);
    expect(nuevoHilo.comments).toBe(0);
  });

  it("setSelectedThreadId actualiza el hilo seleccionado", () => {
    const { result } = renderHook(() => useForum(THREADS_BASE));
    expect(result.current.selectedThreadId).toBeNull();
    act(() => { result.current.setSelectedThreadId(1); });
    expect(result.current.selectedThreadId).toBe(1);
    act(() => { result.current.setSelectedThreadId(null); });
    expect(result.current.selectedThreadId).toBeNull();
  });

});
