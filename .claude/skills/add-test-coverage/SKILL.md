# Skill: Añadir cobertura de tests a un archivo

## Cuándo usar esta skill
Cuando el reporte de cobertura (`npm run test:coverage`) muestra un hook, API o utilidad con menos del 80% de cobertura.

## Pasos a seguir

### 1. Leer el archivo objetivo
Identificar:
- Todas las funciones exportadas
- Los parámetros que acepta cada función
- Los valores que retorna en el happy path
- Los errores o casos límite posibles

### 2. Identificar qué mockear
Para cada import externo del archivo:
- `../../api/gemini` → mockear con `jest.mock()`
- `../../lib/supabaseClient` → mockear el cliente
- Cualquier otro módulo que haga llamadas a red

### 3. Escribir los tests (orden recomendado)

```typescript
describe("nombreFunción()", () => {
  // 1. Setup de mocks
  beforeEach(() => { jest.clearAllMocks(); });

  // 2. Happy path
  it("retorna los datos correctos con input válido", async () => { ... });

  // 3. Input vacío / nulo
  it("retorna null cuando el input está vacío", async () => { ... });

  // 4. Error de API
  it("retorna null cuando la API falla", async () => { ... });

  // 5. Casos de borde
  it("maneja correctamente un array vacío", async () => { ... });
});
```

### 4. Ejecutar y verificar

```bash
# Ejecutar solo los tests del archivo nuevo
npm test -- --testPathPattern=nombreArchivo

# Verificar la cobertura del archivo específico
npm run test:coverage -- --collectCoverageFrom="src/ruta/al/archivo.ts"
```

### 5. Objetivo de cobertura
- Líneas: >80%
- Funciones: >90%
- Branches (if/else, ternarios): >70%

## Errores comunes
- Mockear con `mockResolvedValue` para funciones async, `mockReturnValue` para síncronas
- Usar `await act(async () => {...})` siempre que se llame a funciones async en hooks
- Verificar que el mock está configurado **antes** de renderizar el hook
