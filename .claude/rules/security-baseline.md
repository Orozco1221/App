---
description: Baseline de seguridad que aplica a todos los archivos del proyecto
globs: ["**/*"]
---

# Security Baseline — Randstad AI Hub

Estas reglas aplican a **todos los archivos** del proyecto, sin excepción.

## Variables de entorno

```typescript
// ✅ Correcto — solo en los archivos de configuración de bajo nivel
const url = process.env.REACT_APP_SUPABASE_URL!;

// ❌ Incorrecto — nunca en componentes, hooks, ni en console.log
console.log('URL:', process.env.REACT_APP_SUPABASE_URL);
```

Las tres vars de entorno del proyecto:
- `REACT_APP_SUPABASE_URL`
- `REACT_APP_SUPABASE_ANON_KEY`
- `REACT_APP_GEMINI_KEY`

Nunca deben aparecer en código fuente salvo en `supabaseClient.ts` y `gemini.ts`.

## XSS

React escapa automáticamente en JSX. **Nunca** usar:
```typescript
// ❌ NUNCA — vulnerabilidad XSS directa
<div dangerouslySetInnerHTML={{ __html: userContent }} />
```

Si necesitas renderizar HTML (ej: contenido del admin), usar una librería de sanitización como DOMPurify.

## Uploads de archivos

Siempre validar antes de subir a Supabase Storage:
```typescript
const ALLOWED_TYPES = ['video/mp4', 'application/pdf', 'image/jpeg', 'image/png'];
const MAX_SIZE_MB = 100;

if (!ALLOWED_TYPES.includes(file.type)) {
  setError('Tipo de archivo no permitido');
  return;
}
if (file.size > MAX_SIZE_MB * 1024 * 1024) {
  setError('El archivo supera el tamaño máximo');
  return;
}
```

## Autenticación

`CURRENT_USER_ID = "JP"` es un **placeholder** de desarrollo, no auth real.
Nunca implementar lógica de autorización basada en este valor.
Cuando se implemente auth real (Supabase Auth), reemplazar todos los usos de `CURRENT_USER_ID`.

## Console.log en producción

No hacer `console.log` con datos sensibles: tokens, contraseñas, datos personales de usuarios.
Los `console.error` están permitidos para debugging, pero sin valores de env vars.

## Gestión de secretos

- `.env` está en `.gitignore` — nunca hacer commit de este archivo
- `.env.example` solo debe tener placeholders (`TU_URL_AQUI`, `TU_KEY_AQUI`)
- Si accidentalmente se commitea una clave, revocarla inmediatamente en el proveedor
