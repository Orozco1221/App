# /add-tests [ruta] — Genera tests para un archivo

Genera una suite completa de tests para el archivo especificado, siguiendo las convenciones del proyecto.

## Qué hacer al ejecutar este comando

El argumento es la ruta del archivo a testear (ej: `/add-tests src/hooks/useRanking.ts`).

1. Leer el archivo objetivo para entender:
   - Qué funciones/hooks exporta
   - Qué imports externos tiene (para saber qué mockear)
   - Qué valores retorna en el happy path
   - Qué errores o casos límite puede tener

2. Identificar el archivo de test correspondiente:
   - Si es un hook en `src/hooks/xxx.ts` → test en `src/hooks/__tests__/xxx.test.ts`
   - Si es una API en `src/api/xxx.ts` → test en `src/api/__tests__/xxx.test.ts`

3. Usar la skill `add-test-coverage` para escribir la suite completa

4. Ejecutar los tests para verificar que pasan:
   ```bash
   npm test -- --testPathPattern=nombreArchivo
   ```

5. Si algún test falla, corregirlo antes de terminar.

6. Reportar el resultado:
   - Tests creados y su descripción
   - Cobertura obtenida
   - Casos que quedan pendientes de testear (si los hay)
