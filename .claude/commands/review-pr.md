# /review-pr — Revisión de cambios antes de hacer commit o PR

Revisa todos los archivos modificados en la rama actual y produce un informe de calidad.

## Qué hacer al ejecutar este comando

1. Obtener la lista de archivos cambiados:
   ```bash
   git diff --name-only HEAD
   git diff --name-only --cached
   ```

2. Para cada archivo cambiado, revisar:
   - **TypeScript**: sin `any`, sin `!` fuera de supabaseClient.ts, interfaces correctas
   - **Arquitectura**: lógica de negocio solo en hooks, llamadas a Supabase solo en api/, constantes solo en constants.ts
   - **Tests**: si se añadió código nuevo, ¿hay tests correspondientes?
   - **Texto de UI**: todo en español, sin strings hardcodeados (usar constants.ts)
   - **Patrones de error**: siempre try/catch, siempre retornar null en error
   - **Seguridad**: sin env vars en console.log, sin `dangerouslySetInnerHTML`

3. Ejecutar el build para detectar errores de TypeScript:
   ```bash
   npm run build
   ```

4. Producir el informe con este formato:
   ```
   REVISIÓN DE CÓDIGO — [lista de archivos]
   =========================================
   
   ✅ CORRECTO:
   - [Lista de cosas que están bien]
   
   ⚠️ SUGERENCIAS (no bloqueantes):
   - [Archivo:línea] — descripción
   
   ❌ PROBLEMAS (corregir antes de merge):
   - [Archivo:línea] — descripción y cómo arreglarlo
   
   📋 TESTS:
   - Cobertura nueva: [qué se testea, qué falta]
   ```
