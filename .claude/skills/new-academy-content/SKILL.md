# Skill: Añadir nuevo tipo de contenido a Academy

## Cuándo usar esta skill
Cuando el equipo quiere añadir una nueva categoría de contenido a la sección Academy (por ejemplo: "Sesiones en Vivo", "Podcasts", "Workshops").

## Pasos a seguir en orden

### 1. Añadir la categoría en `src/constants.ts`
```typescript
export const ACADEMY_CATEGORIES = [
  // ... existentes ...
  { key: "nuevaCategoria", label: "Nombre Visible", description: "Descripción corta", color: "emerald" },
] as const;
```

### 2. Verificar el schema de `academy_content` en Supabase
Confirmar que el nuevo valor de `category` es compatible con las políticas RLS y los filtros existentes en `src/api/academyApi.ts`.

### 3. Actualizar `src/api/academyApi.ts`
- Añadir la nueva clave a la interfaz `AcademyContent`
- Actualizar la lógica de agrupación en `fetchAcademyContent()` para incluir la nueva categoría

### 4. Actualizar `src/data/mockData.ts`
Añadir al menos 2 items de ejemplo para la nueva categoría, con todos los campos requeridos de `ContentItem`.

### 5. Actualizar el componente `Academy.tsx`
- Añadir la nueva pestaña/sección correspondiente
- Seguir el patrón visual de las categorías existentes (misma estructura de tarjeta)

### 6. Escribir tests
Crear o actualizar `src/api/__tests__/academyApi.test.ts` para verificar que la nueva categoría se fetcha y agrupa correctamente.

### 7. Verificación final
```bash
npm run build       # sin errores TypeScript
npm test            # todos los tests en verde
npm start           # la nueva categoría aparece en la UI
```

## Errores comunes
- Olvidar actualizar `mockData.ts` → la UI aparece vacía cuando Supabase no tiene datos
- El valor de `key` en `ACADEMY_CATEGORIES` debe coincidir exactamente con el valor en la columna `category` de la BD
- Los colores disponibles de Tailwind: `amber`, `purple`, `blue`, `green`, `emerald`, `rose`, `indigo`
