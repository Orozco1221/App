---
description: Patrones para integración con Google Gemini API
globs: ["src/api/gemini.ts", "src/hooks/**"]
---

# Gemini Integration — Randstad AI Hub

## Regla fundamental

Todas las llamadas a Gemini pasan por `src/api/gemini.ts`. Nunca llamar a la REST API directamente desde componentes o hooks.

```typescript
import { callGemini } from '../api/gemini';
```

## Firma de callGemini

```typescript
callGemini(prompt: string, systemInstruction: string): Promise<string>
```

- `prompt` — la pregunta o tarea específica
- `systemInstruction` — el contexto del "rol" de la IA (siempre en español)
- Retorna el texto de respuesta, o un string de error si falla

## systemInstruction siempre en español

```typescript
// ✅ Correcto
const systemInstruction = `Eres un tutor experto en inteligencia artificial 
que ayuda a empleados de Randstad Digital. Responde siempre en español.`;

// ❌ Incorrecto — en inglés
const systemInstruction = "You are an expert AI tutor...";
```

## Modelo

Usar siempre la constante, nunca hardcodear:
```typescript
import { GEMINI_MODEL_NAME } from '../constants';
// El modelo actual: GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-09-2025"
```

## Strings de error que puede devolver callGemini

```typescript
const response = await callGemini(prompt, systemInstruction);

// Verificar errores antes de usar la respuesta
if (response.startsWith("Error:")) {
  // "Error: API key no configurada."
  // "Error de conexión con la IA."
  console.error('[useXxx] Gemini error:', response);
  return;
}
```

## Parsing de JSON desde Gemini

Gemini puede devolver JSON malformado. Siempre usar try/catch:

```typescript
// Seguir el patrón de parseEvaluation.ts
function parseGeminiJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    console.error('[useXxx] No se pudo parsear respuesta de Gemini:', raw);
    return null;
  }
}
```

## Seguridad: input de usuario en prompts

El input del usuario debe ir entre comillas en el prompt para limitar su alcance:

```typescript
// ✅ Correcto — el input está delimitado
const prompt = `Evalúa el siguiente prompt de IA: "${userInput}"`;

// ❌ Incorrecto — el input puede modificar el comportamiento del sistema
const prompt = `Evalúa este prompt: ${userInput}`;
```

## Tests

En tests, siempre mockear `../../api/gemini`. Nunca llamar a Gemini real.
Usar `GEMINI_MAX_RETRIES` (en constants.ts) para lógica de reintentos si se implementa.
