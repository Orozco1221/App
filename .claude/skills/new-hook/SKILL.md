# Skill: Crear un nuevo custom hook

## Cuándo usar esta skill
Cuando se necesita añadir nueva lógica de negocio a la aplicación (por ejemplo: notificaciones de usuario, sistema de streaks, seguimiento de progreso).

## Pasos a seguir en orden

### 1. Crear `src/hooks/useXxx.ts`

Estructura estándar:
```typescript
// src/hooks/useXxx.ts
import { useState, useEffect, useCallback } from 'react';
// importar de api/ si hace falta
// importar de constants.ts si hace falta

interface UseXxxReturn {
  // estado que expone el hook
  data: XxxItem[];
  isLoading: boolean;
  error: string | null;
  // funciones que expone el hook
  fetchData: () => Promise<void>;
  doAction: (id: string) => Promise<void>;
}

export function useXxx(): UseXxxReturn {
  const [data, setData] = useState<XxxItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetchXxxFromApi();
      if (result) setData(result);
    } catch (err) {
      console.error('[useXxx] Error:', err);
      setError('No se pudieron cargar los datos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { data, isLoading, error, fetchData, doAction };
}
```

### 2. Crear `src/hooks/__tests__/useXxx.test.ts`

Seguir el patrón de `useChallenge.test.ts`:
- Mockear todos los módulos externos
- `beforeEach(() => { jest.clearAllMocks(); })`
- Testear: estado inicial, happy path, manejo de error, casos límite

### 3. Añadir el hook en `App.tsx`

```tsx
// En App.tsx, junto a los otros hooks
const { data, isLoading, doAction } = useXxx();

// Pasar por props al componente
<ErrorBoundary sectionName="NuevaSección">
  <NuevaSección data={data} isLoading={isLoading} onAction={doAction} />
</ErrorBoundary>
```

### 4. Verificación

```bash
npm test src/hooks/__tests__/useXxx.test.ts
npm run build
```

## Errores comunes
- No incluir `fetchData` en el `useCallback` dependency array si usa variables externas
- Olvidar el `finally` → `isLoading` se queda en `true` si hay un error
- No limpiar subscripciones de `useEffect` si el componente puede desmontarse durante el fetch
