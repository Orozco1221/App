// src/api/__tests__/gemini.test.ts
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
function mockFetchOk(text: string): void {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok: true,
    json: async () => ({
      candidates: [{ content: { parts: [{ text }] } }]
    }),
  });
}

// Función helper que crea una respuesta falsa de fetch que falla
function mockFetchError(status = 500): void {
  (global.fetch as jest.Mock) = jest.fn().mockResolvedValue({
    ok: false,
    status,
  });
}

// Antes de cada test, limpiamos los mocks y establecemos un fetch por defecto
// para evitar llamadas reales a la red con fake timers activos
beforeEach(() => {
  jest.clearAllMocks();
  jest.useFakeTimers();
  // Fetch por defecto: falla inmediatamente (evita cuelgues de red con fake timers)
  (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(new Error('fetch not mocked for this test'));
});

// Al terminar todos los tests, restauramos fetch y los timers reales
afterAll(() => {
  global.fetch = originalFetch;
  jest.useRealTimers();
});

// Importamos DESPUÉS de configurar el entorno para que los mocks funcionen
import { callGemini } from '../gemini';

describe('callGemini()', () => {

  // ── Test 1: Sin API key o fallo de conexión ─────────────────
  it('devuelve mensaje de error si no hay API key o la API falla', async () => {
    // apiKey se captura al cargar el módulo. Si no había key en el env,
    // callGemini devuelve "Error: API key no configurada." inmediatamente.
    // Si sí había key, fetch está mockeado para fallar; pasamos retries=5
    // (= GEMINI_MAX_RETRIES) para saltar el bucle de reintentos con fake timers.
    const resultado = await callGemini('hola', '', 5);

    // En ambos casos debe devolver un mensaje que contiene "Error"
    expect(resultado).toContain('Error');
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
    const callArgs = (global.fetch as jest.Mock).mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(callArgs[1].body) as { contents: { parts: { text: string }[] }[] };
    expect(body.contents[0].parts[0].text).toBe('evalúa este prompt especial');
  });

  // ── Test 4: Error de red → mensaje amigable ──────────────────
  it('devuelve mensaje amigable si la API devuelve error', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';

    // Simulamos que fetch lanza un error de red directamente
    (global.fetch as jest.Mock) = jest.fn().mockRejectedValue(new Error('Network error'));

    // Pasamos retries = GEMINI_MAX_RETRIES para saltar directamente al último intento
    // evitando que entre en el bucle de reintentos con fake timers
    const promise = callGemini('hola', '', 5);
    jest.runAllTimers();
    const resultado = await promise;

    expect(resultado).toBe('Error de conexión con la IA.');
  });

  // ── Test 5: System instruction se incluye si se pasa ────────
  it('incluye systemInstruction en el body cuando se proporciona', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';
    mockFetchOk('ok');

    await callGemini('mi prompt', 'Eres un juez experto');

    const callArgs = (global.fetch as jest.Mock).mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(callArgs[1].body) as { systemInstruction: { parts: { text: string }[] } };
    expect(body.systemInstruction.parts[0].text).toBe('Eres un juez experto');
  });

  // ── Test 6: Sin system instruction → no se envía el campo ───
  it('NO incluye systemInstruction en el body si no se pasa', async () => {
    process.env.REACT_APP_GEMINI_KEY = 'test-key-123';
    mockFetchOk('ok');

    await callGemini('mi prompt'); // sin system instruction

    const callArgs = (global.fetch as jest.Mock).mock.calls[0] as [string, { body: string }];
    const body = JSON.parse(callArgs[1].body) as Record<string, unknown>;
    expect(body.systemInstruction).toBeUndefined();
  });

});
