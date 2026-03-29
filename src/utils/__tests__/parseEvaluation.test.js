// src/utils/__tests__/parseEvaluation.test.js

import { parseEvaluation } from '../parseEvaluation';

describe('parseEvaluation()', () => {

  // ── Test 1: JSON válido limpio ───────────────────────────────
  it('parsea correctamente un JSON limpio', () => {
    const input = '{"score": 4, "feedback": "Muy buen trabajo"}';
    const resultado = parseEvaluation(input);

    expect(resultado.score).toBe(4);
    expect(resultado.feedback).toBe('Muy buen trabajo');
  });

  // ── Test 2: JSON envuelto en markdown ────────────────────────
  // Gemini a veces devuelve el JSON dentro de bloques de código
  it('limpia los bloques de markdown ```json antes de parsear', () => {
    const input = '```json
{"score": 5, "feedback": "Excelente"}
```';
    const resultado = parseEvaluation(input);

    expect(resultado.score).toBe(5);
    expect(resultado.feedback).toBe('Excelente');
  });

  // ── Test 3: JSON inválido → fallback ────────────────────────
  it('devuelve score=3 y feedback genérico si el JSON está roto', () => {
    const input = 'esto no es json válido {{{';
    const resultado = parseEvaluation(input);

    expect(resultado.score).toBe(3);
    expect(resultado.feedback).toBe('Evaluación completada.');
  });

  // ── Test 4: Respuesta vacía → fallback ──────────────────────
  it('devuelve el fallback si la respuesta está vacía', () => {
    expect(parseEvaluation('').score).toBe(3);
    expect(parseEvaluation(null).score).toBe(3);
    expect(parseEvaluation(undefined).score).toBe(3);
  });

  // ── Test 5: Score fuera de rango → se fuerza al rango 0-5 ──
  it('fuerza el score al rango 0-5 si Gemini devuelve un valor extraño', () => {
    // Score mayor que 5
    const alto = parseEvaluation('{"score": 99, "feedback": "Ok"}');
    expect(alto.score).toBe(5);

    // Score negativo
    const negativo = parseEvaluation('{"score": -3, "feedback": "Ok"}');
    expect(negativo.score).toBe(0);
  });

});
