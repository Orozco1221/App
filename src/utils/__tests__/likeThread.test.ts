// src/utils/__tests__/likeThread.test.ts
// ============================================================
// ¿QUÉ TESTEAMOS AQUÍ?
// La lógica de dar y quitar likes en el foro.
// Es la parte más importante del foro: si falla, los usuarios
// verían likes incorrectos o duplicados.
//
// Seguimos el patrón TDD:
//   1. Describimos el comportamiento esperado con palabras
//   2. Lo verificamos con código
// ============================================================

import { likeThread } from '../likeThread';
import type { Thread } from '../likeThread';

// Datos de ejemplo que usaremos en todos los tests.
// Los definimos aquí arriba para no repetirlos en cada test.
const THREADS_BASE: Thread[] = [
  {
    id: 1,
    title: 'Hilo de prueba',
    likes: 15,
    likedBy: [],   // nadie ha dado like todavía
  },
  {
    id: 2,
    title: 'Otro hilo',
    likes: 5,
    likedBy: ['JP'], // JP ya ha dado like a este hilo
  },
];

const USER_ID = 'JP';

describe('likeThread()', () => {

  // ── Test 1: Dar like ─────────────────────────────────────────
  it('añade el like cuando el usuario NO había dado like antes', () => {
    const resultado = likeThread(THREADS_BASE, 1, USER_ID);
    const hiloActualizado = resultado.find(t => t.id === 1)!;

    // Los likes deben haber subido de 15 a 16
    expect(hiloActualizado.likes).toBe(16);

    // El ID del usuario debe estar en likedBy
    expect(hiloActualizado.likedBy).toContain(USER_ID);
  });

  // ── Test 2: Quitar like ──────────────────────────────────────
  it('quita el like cuando el usuario YA había dado like', () => {
    // El hilo 2 ya tiene like de JP
    const resultado = likeThread(THREADS_BASE, 2, USER_ID);
    const hiloActualizado = resultado.find(t => t.id === 2)!;

    // Los likes deben haber bajado de 5 a 4
    expect(hiloActualizado.likes).toBe(4);

    // El ID del usuario ya NO debe estar en likedBy
    expect(hiloActualizado.likedBy).not.toContain(USER_ID);
  });

  // ── Test 3: Idempotencia ─────────────────────────────────────
  // "Idempotencia" = hacer la misma acción dos veces da el mismo resultado
  // que hacerla una sola vez. Un like doble NO debe duplicar el ID en likedBy.
  it('no duplica el ID en likedBy si se llama dos veces seguidas', () => {
    // Primera llamada: JP da like al hilo 1
    const primeraVez = likeThread(THREADS_BASE, 1, USER_ID);
    // Segunda llamada: JP intenta dar like de nuevo al mismo hilo
    const segundaVez = likeThread(primeraVez, 1, USER_ID);

    const hilo = segundaVez.find(t => t.id === 1)!;

    // Después de dar like y quitarlo, los likes vuelven a 15
    expect(hilo.likes).toBe(15);

    // El ID de JP no debe aparecer duplicado (ni aparecer, porque lo quitó)
    const aparicionesJP = hilo.likedBy.filter(uid => uid === USER_ID);
    expect(aparicionesJP).toHaveLength(0);
  });

  // ── Test 4: Hilo inexistente ─────────────────────────────────
  it('no modifica nada si el threadId no existe', () => {
    const resultado = likeThread(THREADS_BASE, 999, USER_ID);

    // Los hilos deben ser exactamente iguales que al principio
    expect(resultado[0].likes).toBe(15);
    expect(resultado[1].likes).toBe(5);
    expect(resultado).toHaveLength(THREADS_BASE.length);
  });

  // ── Test 5: No modifica otros hilos ─────────────────────────
  it('solo modifica el hilo con el ID correcto, no toca los demás', () => {
    const resultado = likeThread(THREADS_BASE, 1, USER_ID);

    // El hilo 1 cambió (era el objetivo)
    expect(resultado.find(t => t.id === 1)!.likes).toBe(16);

    // El hilo 2 NO debe haber cambiado
    expect(resultado.find(t => t.id === 2)!.likes).toBe(5);
    expect(resultado.find(t => t.id === 2)!.likedBy).toContain('JP');
  });

});
