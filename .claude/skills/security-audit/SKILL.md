# Skill: Auditoría de seguridad pre-despliegue

## Cuándo usar esta skill
Antes de cualquier release importante, o después de añadir features que manejan input de usuario, uploads de archivos, o cambios en el schema de Supabase.

## Pasos del audit

### 1. Verificar que no hay claves en el código ni en git
```bash
# Buscar env vars hardcodeadas en el código
grep -r "REACT_APP_" src/ --include="*.ts" --include="*.tsx" | grep -v "process.env"

# Verificar que .env no está en git
git check-ignore .env

# Buscar si alguna vez se commitió .env por error
git log --all --full-history -- .env
```

### 2. Revisar console.logs con datos sensibles
Buscar en `src/` cualquier `console.log` que incluya env vars, tokens, o datos de usuario.

### 3. Verificar políticas RLS en Supabase
Para cada tabla del proyecto, confirmar en el dashboard de Supabase que:
- RLS está activado
- Existe al menos una política de SELECT
- No hay políticas con `USING (true)` sin restricción de usuario

### 4. Revisar validación de inputs de usuario
Buscar todos los `<input>`, `<textarea>` y `<form>` del proyecto y verificar:
- Hay validación de longitud máxima
- El contenido se renderiza con JSX normal (no `dangerouslySetInnerHTML`)

### 5. Revisar uploads de archivos
En cualquier upload a Supabase Storage, verificar:
- Se valida `file.type` contra una lista blanca
- Se valida `file.size` con un límite razonable

### 6. Revisar prompts de Gemini con input de usuario
En `src/hooks/` y `src/api/`, verificar que todo input de usuario va entre comillas en el prompt:
```typescript
// ✅ Seguro
`Evalúa: "${userInput}"`
// ❌ Inseguro
`Evalúa: ${userInput}`
```

### 7. Generar el informe
Documentar los hallazgos con formato:
```
[ALTA/MEDIA/BAJA] Descripción — Archivo:línea
Riesgo: qué puede ocurrir
Recomendación: cómo arreglarlo
```

## Notas sobre riesgos aceptados
- `REACT_APP_GEMINI_KEY` expuesta en bundle cliente: riesgo conocido, aceptado para esta fase
- `CURRENT_USER_ID = "JP"`: auth real no implementada, no tratar como auth
