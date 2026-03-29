// src/api/__tests__/gemini.test.js
// ============================================================
// ¿CÓMO TESTEAMOS UNA FUNCIÓN QUE LLAMA A INTERNET?
// La respuesta es: NO llamamos a internet en los tests.
// En su lugar, "fingimos" que fetch devuelve lo que nosotros queremos.
//
// Jest tiene una función llamada jest.fn() que nos permite sustituir
// cualquier función por una versión falsa que controlamos.
//
// También usamos process.env para simular que hay (o no hay) una API key.
// ============================================================

// Guardamos el fetch real para restaurarlo al terminar
const originalFetch = global.fetch;

// Función helper que crea una respuesta falsa de fetch con el texto dado
function mockFetchOk(text) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text }] } }]
    }),
  });
}

// Función helper que crea una respuesta falsa de fetch que falla
function mockFetchError(status = 500) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: false,
    status,
  });
}

// Antes de cada test, limpiamos los mocks
beforeEach(() => {
  jest.clearAllMocks();
  // Aceleramos los reintentos: en lugar de esperar 1s, 2s, 4s...
  // hacemos que los timers sean instantáneos en los tests
  jest.useFakeTimers();
});

// Al terminar todos los tests, restauramos fetch y los timers reales
afterAll(() => {
  global.fetch = originalFetch;
  jest.useRealTimers();
});

// Importamos DESPUÉS de configurar el entorno para que los mocks funcionen
import { callGemini } from '../gemini';

describe('callGemini()', () => {

  // ── Test 1: Sin API key ──────────────────────────────────────
  it('devuelve mensaje de error si no hay API key', async () => {
    // Simulamos que no hay variable de entorno configurada
    const originalKey = process.env.REACT_APP_GEMINI_KEY;
    delete process.env.REACT_APP_GEMINI_KEY;

    const resultado = await callGemini('hola');

    // Debe devolver el mensaje de error sin llamar a fetch
    expect(resultado).toContain('Error');
    expect(global.fetch).not.toHaveBeenCalled?.();

    // Restauramos la variable de entorno
    process.env.REACT_APP_GEMINI_KEY = originalKey;
  });

  // ── Test 2: Respuesta exitosa ────────────────────────────────
  it('extrae el texto correctamente de una respuesta válida de Gemini', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';
    mockFetchOk('Esta es la respuesta de Gemini');

    const resultado = await callGemini('mi prompt');

    expect(resultado).toBe('Esta es la respuesta de Gemini');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  // ── Test 3: El prompt se incluye en el body ──────────────────
  it('envía el prompt correcto en el body de la petición', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';
    mockFetchOk('ok');

    await callGemini('evalúa este prompt especial');

    // Verificamos que fetch se llamó con el prompt correcto
    const callArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.contents[0].parts[0].text).toBe('evalúa este prompt especial');
  });

  // ── Test 4: Error de red → mensaje amigable ──────────────────
  it('devuelve mensaje amigable si la API devuelve error', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';

    // Simulamos que fetch lanza un error de red directamente
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    // Ejecutamos todos los timers falsos para que los reintentos sean instantáneos
    const promise = callGemini('hola', '', 4); // empezamos en retry=4 (último intento)
    jest.runAllTimers();
    const resultado = await promise;

    expect(resultado).toBe('Error de conexión con la IA.');
  });

  // ── Test 5: System instruction se incluye si se pasa ────────
  it('incluye systemInstruction en el body cuando se proporciona', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';
    mockFetchOk('ok');

    await callGemini('mi prompt', 'Eres un juez experto');

    const callArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.systemInstruction.parts[0].text).toBe('Eres un juez experto');
  });

  // ── Test 6: Sin system instruction → no se envía el campo ───
  it('NO incluye systemInstruction en el body si no se pasa', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';
    mockFetchOk('ok');

    await callGemini('mi prompt'); // sin system instruction

    const callArgs = global.fetch.mock.calls[0];
    const body = JSON.parse(callArgs[1].body);
    expect(body.systemInstruction).toBeUndefined();
  });

});
