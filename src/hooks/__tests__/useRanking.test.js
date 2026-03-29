// src/hooks/__tests__/useRanking.test.js

import { renderHook, act } from "@testing-library/react";
import { useRanking } from "../useRanking";

jest.mock("../../api/gemini", () => ({
  callGemini: jest.fn().mockResolvedValue("Aqui van tus consejos de mentor"),
}));
import { callGemini } from "../../api/gemini";

// Datos sin ordenar a proposito para probar el sorting
const RANKING_DATA = [
  { id: "3",  name: "Marta Soto",   points: 1500, tier: "AI Explorer",   avatar: "MS" },
  { id: "JP", name: "Juan Perez",   points: 1850, tier: "AI Explorer",   avatar: "JP" },
  { id: "1",  name: "Ana Martinez", points: 2850, tier: "AI Visionary",  avatar: "AM" },
  { id: "2",  name: "Carlos Perez", points: 2420, tier: "AI Strategist", avatar: "CP" },
];

describe("useRanking()", () => {

  beforeEach(() => jest.clearAllMocks());

  it("sortedRanking ordena los usuarios de mayor a menor puntuacion", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    const puntos = result.current.sortedRanking.map(u => u.points);
    for (let i = 0; i < puntos.length - 1; i++) {
      expect(puntos[i]).toBeGreaterThanOrEqual(puntos[i + 1]);
    }
  });

  it("sortedRanking asigna position correcta a cada usuario (1-indexed)", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    expect(result.current.sortedRanking[0].position).toBe(1);
    expect(result.current.sortedRanking[0].name).toBe("Ana Martinez");
    expect(result.current.sortedRanking[1].position).toBe(2);
    expect(result.current.sortedRanking[1].name).toBe("Carlos Perez");
    expect(result.current.sortedRanking[2].position).toBe(3);
    expect(result.current.sortedRanking[2].name).toBe("Juan Perez");
    expect(result.current.sortedRanking[3].position).toBe(4);
    expect(result.current.sortedRanking[3].name).toBe("Marta Soto");
  });

  it("myIndex apunta al indice correcto del usuario actual (JP)", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    expect(result.current.myIndex).toBe(2);
    expect(result.current.sortedRanking[result.current.myIndex].id).toBe("JP");
  });

  it("podiumUsers devuelve exactamente los 3 primeros del ranking", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    expect(result.current.podiumUsers).toHaveLength(3);
    expect(result.current.podiumUsers[0].id).toBe("1");
    expect(result.current.podiumUsers[1].id).toBe("2");
    expect(result.current.podiumUsers[2].id).toBe("JP");
  });

  it("getDisplayRanking sin showAll siempre incluye al usuario actual", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    const displayed = result.current.getDisplayRanking();
    expect(displayed.some(u => u.id === "JP")).toBe(true);
  });

  it("getDisplayRanking con showAll devuelve todos los usuarios", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    act(() => { result.current.setShowAllRanking(true); });
    const displayed = result.current.getDisplayRanking();
    expect(displayed).toHaveLength(RANKING_DATA.length);
  });

  it("showAllRanking empieza en false y se puede activar y desactivar", () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    expect(result.current.showAllRanking).toBe(false);
    act(() => { result.current.setShowAllRanking(true); });
    expect(result.current.showAllRanking).toBe(true);
    act(() => { result.current.setShowAllRanking(false); });
    expect(result.current.showAllRanking).toBe(false);
  });

  it("askMentor llama a callGemini con la posicion y XP del usuario actual", async () => {
    const { result } = renderHook(() => useRanking(RANKING_DATA));
    await act(async () => { await result.current.askMentor(); });
    expect(callGemini).toHaveBeenCalledTimes(1);
    const prompt = callGemini.mock.calls[0][0];
    expect(prompt).toContain("3");
    expect(prompt).toContain("1850");
  });

});
