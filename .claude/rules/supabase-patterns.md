---
description: Patrones para todo el código que interactúa con Supabase
globs: ["src/api/**", "src/lib/**"]
---

# Supabase Patterns — Randstad AI Hub

## Regla fundamental

El cliente Supabase es un **singleton**. Siempre importar desde:
```typescript
import { supabase } from '../lib/supabaseClient';
```
**Nunca** crear `createClient()` en otro archivo.

## Convención snake_case ↔ camelCase

- Columnas en la BD: `snake_case` (`short_desc`, `media_url`, `created_at`)
- Interfaces TypeScript: `camelCase` (`shortDesc`, `mediaUrl`, `createdAt`)
- La función `mapRowToItem()` hace la traducción — actualizarla cuando cambie el schema

## Patrón de fetch

```typescript
interface XxxRow {
  id: string;
  campo_bd: string;
  // ... columnas en snake_case
}

export async function fetchXxx(): Promise<XxxItem[] | null> {
  const { data, error } = await supabase
    .from('nombre_tabla')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[xxxApi] Error al obtener datos:', error);
    return null;
  }
  return (data as XxxRow[]).map(mapRowToXxxItem);
}
```

## Patrón de insert con retorno del row

```typescript
const { data, error } = await supabase
  .from('nombre_tabla')
  .insert({ campo_bd: valor })
  .select()
  .single();

if (error) {
  console.error('[xxxApi] Error al insertar:', error);
  return null;
}
```

## Storage (archivos)

- Bucket: `academy-files`
- Ruta: `{category}/{timestamp}-{filename}`
- Validar `file.type` y `file.size` **antes** de hacer el upload

```typescript
const filePath = `${category}/${Date.now()}-${file.name}`;
const { error } = await supabase.storage
  .from('academy-files')
  .upload(filePath, file);
```

## RLS

- RLS está activo en todas las tablas
- Las queries con `anon key` (la clave pública del cliente) tienen acceso limitado
- Antes de añadir una tabla nueva, configurar las políticas RLS correspondientes
- `CURRENT_USER_ID = "JP"` es un placeholder, no es autenticación real

## Console.error

Siempre incluir el prefijo del módulo:
```typescript
console.error('[academyApi] mensaje descriptivo:', error);
```
