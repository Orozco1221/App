// src/hooks/__tests__/useChallenge.test.js
// ================================================================
// COMO TESTEAMOS HOOKS DE REACT?
// Los hooks usan el estado de React, asi que necesitamos
// renderHook de @testing-library/react.
//
// renderHook monta el hook en un componente invisible y nos
// permite leer su estado y llamar a sus funciones.
//
// act() es necesario cuando una accion cambia el estado de React.
// ================================================================

import { renderHook, act } from "@testing-library/react";
import { useChallenge } from "../useChallenge";

jest.mock("../../api/gemini", () => ({
  callGemini: jest.fn(),
}));
import { callGemini } from "../../api/gemini";

jest.mock("../../utils/parseEvaluation", () => ({
  parseEvaluation: jest.fn((raw) => {
    try { return JSON.parse(raw); }
    catch { return { score: 3, feedback: "Evaluacion completada." }; }
  }),
}));

describe("useChallenge()", () => {

  beforeEach(() => {
    jest.clearAllMocks();
    callGemini.mockResolvedValue('{"score": 4, "feedback": "Muy buen prompt"}');
  });

  it("tiene el estado inicial correcto", () => {
    const { result } = renderHook(() => useChallenge());
    expect(result.current.submissionText).toBe("");
    expect(result.current.evaluation).toBeNull();
    expect(result.current.isEvaluating).toBe(false);
  });

  it("setSubmissionText actualiza el texto correctamente", () => {
    const { result } = renderHook(() => useChallenge());
    act(() => { result.current.setSubmissionText("Mi prompt de prueba"); });
    expect(result.current.submissionText).toBe("Mi prompt de prueba");
  });

  it("evaluateChallenge NO llama a callGemini si el texto esta vacio", async () => {
    const { result } = renderHook(() => useChallenge());
    await act(async () => { await result.current.evaluateChallenge(); });
    expect(callGemini).not.toHaveBeenCalled();
    expect(result.current.evaluation).toBeNull();
  });

  it("evaluateChallenge NO evalua si el texto es solo espacios", async () => {
    const { result } = renderHook(() => useChallenge());
    act(() => { result.current.setSubmissionText("   "); });
    await act(async () => { await result.current.evaluateChallenge(); });
    expect(callGemini).not.toHaveBeenCalled();
  });

  it("evaluateChallenge llama a callGemini incluyendo el texto del usuario", async () => {
    const { result } = renderHook(() => useChallenge());
    act(() => { result.current.setSubmissionText("Actua como experto en IA"); });
    await act(async () => { await result.current.evaluateChallenge(); });
    const prompt = callGemini.mock.calls[0][0];
    expect(prompt).toContain("Actua como experto en IA");
  });

  it("isEvaluating es true durante la llamada y false al terminar", async () => {
    const { result } = renderHook(() => useChallenge());
    let resolveGemini;
    callGemini.mockReturnValue(new Promise(r => { resolveGemini = r; }));
    act(() => { result.current.setSubmissionText("Mi prompt"); });
    act(() => { result.current.evaluateChallenge(); });
    expect(result.current.isEvaluating).toBe(true);
    await act(async () => { resolveGemini('{"score": 4, "feedback": "Bien"}'); });
    expect(result.current.isEvaluating).toBe(false);
  });

  it("evaluation se actualiza con el resultado parseado de Gemini", async () => {
    const { result } = renderHook(() => useChallenge());
    act(() => { result.current.setSubmissionText("Mi prompt"); });
    await act(async () => { await result.current.evaluateChallenge(); });
    expect(result.current.evaluation).not.toBeNull();
    expect(result.current.evaluation).toHaveProperty("score");
    expect(result.current.evaluation).toHaveProperty("feedback");
  });

  it("setEvaluation(null) permite reintentar la evaluacion", async () => {
    const { result } = renderHook(() => useChallenge());
    act(() => { result.current.setSubmissionText("Mi prompt"); });
    await act(async () => { await result.current.evaluateChallenge(); });
    expect(result.current.evaluation).not.toBeNull();
    act(() => { result.current.setEvaluation(null); });
    expect(result.current.evaluation).toBeNull();
  });

});
