---
description: Patrones de React establecidos en el proyecto para componentes y hooks
globs: ["src/components/**", "src/hooks/**", "src/App.tsx"]
---

# React Patterns — Randstad AI Hub

## Separación de responsabilidades

```
src/hooks/     → lógica de negocio, estado, efectos secundarios
src/api/       → llamadas a Supabase y Gemini
src/components/→ presentación pura, props + callbacks
```

**Nunca** poner llamadas a Supabase ni lógica de negocio dentro de un componente.

## Hooks

- Naming: `useXxx` con interfaz de retorno explícita `interface UseXxxReturn`
- `useMemo` para datos derivados de arrays costosos:
  ```typescript
  const sortedItems = useMemo(() => items.sort(...), [items]);
  ```
- `useEffect` con `[]` solo para efectos de montaje único (cargar datos iniciales)
- `useCallback` para funciones que se pasan como props a componentes memorizados

## Componentes

- Únicamente funcionales (no class components)
- Sub-componentes internos pueden definirse dentro de la función padre si son pequeños (ver `NavItem` en `App.tsx`)
- Props opcionales con valor por defecto en la destructuring: `{ isLoading = false }`

## ErrorBoundary (obligatorio en App.tsx)

Toda sección nueva se envuelve en `<ErrorBoundary>`:
```tsx
<ErrorBoundary sectionName="NuevaSección">
  <NuevaSección {...props} />
</ErrorBoundary>
```

## Estado de carga

```tsx
if (isLoading) return (
  <div className="flex justify-center items-center py-12">
    <Loader2 size={36} className="animate-spin opacity-50 text-blue-500" />
  </div>
);
```

## Manejo de errores en hooks

```typescript
async function fetchData() {
  try {
    const result = await apiFunction();
    if (!result) return; // API devuelve null en error
    setState(result);
  } catch (error) {
    console.error('[useXxx] Error:', error);
    // No relanzar — degradación graceful
  }
}
```
