---
description: Convenciones de tests con Jest y React Testing Library
globs: ["**/__tests__/**", "**/*.test.ts", "**/*.test.tsx"]
---

# Testing Conventions — Randstad AI Hub

## Referencia canónica

Seguir la estructura de `src/hooks/__tests__/useChallenge.test.ts` para todos los tests de hooks.

## Naming

```typescript
describe("useChallenge()", () => {       // nombre de la unidad entre paréntesis
  it("tiene el estado inicial correcto", () => { ... });
  it("llama a callGemini con el prompt correcto", async () => { ... });
  it("NO llama a la API cuando el input está vacío", async () => { ... });
  it("maneja el error cuando callGemini falla", async () => { ... });
});
```

## Mocks

```typescript
// Gemini — siempre mockear, nunca llamar a la API real
jest.mock("../../api/gemini", () => ({
  callGemini: jest.fn(),
}));
import { callGemini } from "../../api/gemini";
const mockCallGemini = callGemini as jest.MockedFunction<typeof callGemini>;

// Reset obligatorio
beforeEach(() => {
  jest.clearAllMocks();
  mockCallGemini.mockResolvedValue('respuesta por defecto');
});
```

## renderHook + act

```typescript
import { renderHook, act } from "@testing-library/react";

// Estado inicial (síncrono)
const { result } = renderHook(() => useXxx());
expect(result.current.valor).toBe(valorEsperado);

// Acción que cambia estado (síncrono)
act(() => { result.current.setValor("nuevo"); });

// Acción asíncrona
await act(async () => {
  await result.current.funcionAsync("input");
});
```

## Qué testear

- Estado inicial del hook
- Resultado de cada función exportada (happy path)
- Manejo de error (cuando la API devuelve error o null)
- Casos límite (input vacío, arrays vacíos, valores nulos)
- Qué funciones **no** se llaman cuando no deberían

## Qué NO testear

- Detalles de implementación internos
- Variables de estado internas que no se exponen
- Orden exacto de llamadas a mocks (salvo que sea crítico)

## Cobertura

```bash
npm run test:coverage
```
Objetivo: >80% en `src/hooks/` y `src/api/`.
Excluidos: `src/index.tsx`, `src/data/mockData.ts`.
