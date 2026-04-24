# /check-security — Audit de seguridad rápido

Ejecuta la skill de auditoría de seguridad sobre los archivos recientemente modificados.

## Qué hacer al ejecutar este comando

1. Identificar los archivos cambiados recientemente:
   ```bash
   git diff --name-only HEAD
   git diff --name-only --cached
   ```

2. Ejecutar la skill `security-audit` enfocada en esos archivos:
   - Buscar env vars fuera de supabaseClient.ts y gemini.ts
   - Revisar console.log con datos sensibles
   - Verificar validación de inputs de usuario
   - Revisar validación de uploads si hay cambios en código de storage
   - Verificar que prompts de Gemini con input de usuario van entre comillas
   - Comprobar que no hay `dangerouslySetInnerHTML`

3. Si hay cambios en `src/api/` o tablas de Supabase, verificar también:
   - RLS activo en las tablas afectadas
   - Políticas de acceso correctas

4. Producir el informe de seguridad con severidad Alta/Media/Baja.

5. Documentar los riesgos aceptados conocidos (Gemini key en cliente, auth placeholder).
