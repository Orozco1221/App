---
description: Reglas de TypeScript estricto para todos los archivos .ts y .tsx del proyecto
globs: ["**/*.ts", "**/*.tsx"]
---

# TypeScript Strict — Randstad AI Hub

## Tipos

- **Nunca usar `any`**. Alternativas: `unknown` con type guard, `never`, o crear una interfaz propia.
- Preferir `interface` sobre `type` para shapes de objetos (son extensibles con `extends`)
- Usar `type` solo para unions, intersections o aliases de primitivos: `type Status = 'loading' | 'success' | 'error'`
- `as const` en arrays de literales para inferencia exacta (ver `ACADEMY_CATEGORIES`, `RANKING_TIERS`, `FORUM_CATEGORIES` en `constants.ts`)
- Exportar interfaces desde el archivo donde se define el dato

## Imports

- `import type { Foo }` para imports de solo tipos — ayuda al compilador y al tree-shaking
- Nunca importar desde rutas absolutas — usar rutas relativas (`../../api/gemini`)

## Non-null assertions

- El `!` solo está permitido en `src/lib/supabaseClient.ts` para variables de entorno
- En el resto del código: usar optional chaining `?.` o comprobaciones explícitas

## Interfaces de retorno de hooks

```typescript
// ✅ Correcto — interfaz nombrada para el retorno
interface UseXxxReturn {
  data: ContentItem[];
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}
export function useXxx(): UseXxxReturn { ... }
```

## Props de componentes

```typescript
// ✅ Correcto — interfaz explícita encima del componente
interface MyComponentProps {
  items: ContentItem[];
  onSelect: (id: string) => void;
  isLoading?: boolean;
}
function MyComponent({ items, onSelect, isLoading = false }: MyComponentProps) { ... }
```

## Verificación

Ejecutar `npm run build` para detectar errores de TypeScript antes de hacer commit.
