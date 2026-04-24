# Skill: Migración de schema de Supabase

## Cuándo usar esta skill
Cuando se necesita añadir una columna nueva, crear una tabla nueva, o modificar el schema existente de Supabase.

## Pasos a seguir en orden

### 1. Escribir el SQL de migración

Para una columna nueva:
```sql
-- Añadir columna con valor por defecto para no romper filas existentes
ALTER TABLE nombre_tabla
ADD COLUMN nueva_columna tipo DEFAULT valor_por_defecto;
```

Para una tabla nueva:
```sql
CREATE TABLE nombre_tabla (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo_texto TEXT NOT NULL,
  campo_numero INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activar RLS siempre
ALTER TABLE nombre_tabla ENABLE ROW LEVEL SECURITY;

-- Crear política básica de lectura
CREATE POLICY "Lectura pública" ON nombre_tabla
  FOR SELECT USING (true);
```

### 2. Aplicar en Supabase
Ejecutar el SQL en el dashboard de Supabase → SQL Editor, o usar la herramienta MCP de Supabase disponible.

### 3. Actualizar la interfaz `XxxRow` en el API
```typescript
// En src/api/xxxApi.ts
interface XxxRow {
  // ... columnas existentes ...
  nueva_columna: string | null; // snake_case, nullable si tiene DEFAULT
}
```

### 4. Actualizar `mapRowToXxxItem()`
```typescript
function mapRowToXxxItem(row: XxxRow): XxxItem {
  return {
    // ... campos existentes ...
    nuevoCampo: row.nueva_columna ?? 'valor por defecto',
  };
}
```

### 5. Actualizar la interfaz TypeScript del dominio
Si `XxxItem` está definido en otro archivo (como `mockData.ts`), actualizar también ahí.

### 6. Actualizar `src/data/mockData.ts`
```typescript
// Añadir el nuevo campo en los items de ejemplo
const mockXxxItems: XxxItem[] = [
  {
    // ... campos existentes ...
    nuevoCampo: 'valor de ejemplo',
  },
];
```

### 7. Verificar
```bash
npm run build    # sin errores TypeScript
npm test         # todos los tests en verde
```

## Errores comunes
- Olvidar activar RLS en tablas nuevas → cualquiera puede leer/escribir
- No añadir DEFAULT en columnas NOT NULL → las filas existentes fallan al hacer SELECT
- Olvidar actualizar `mockData.ts` → la app crashea cuando Supabase está vacío
- No actualizar el tipo en la interfaz TypeScript → TypeScript no detecta el nuevo campo
