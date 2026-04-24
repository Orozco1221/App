# /explain-code [ruta] — Explica un archivo en español sencillo

Explica qué hace un archivo del proyecto en lenguaje claro, sin jerga técnica innecesaria.

## Qué hacer al ejecutar este comando

El argumento es la ruta del archivo a explicar (ej: `/explain-code src/hooks/useRanking.ts`).

Leer el archivo y producir una explicación con esta estructura:

```
📄 EXPLICACIÓN DE: [nombre del archivo]
========================================

🎯 QUÉ HACE:
[1-2 frases en español claro. Sin jerga. Como si se lo explicaras a alguien que no programa.]

📥 QUÉ NECESITA PARA FUNCIONAR:
[Lista de inputs, parámetros o datos de los que depende]

📤 QUÉ PRODUCE O DEVUELVE:
[Qué datos o efectos produce]

🔗 QUIÉN LO USA:
[Qué otros archivos o partes de la app llaman a este]

⚠️ QUÉ PASARÍA SI SE BORRARA:
[Consecuencias concretas en la aplicación]

💡 NOTAS IMPORTANTES:
[Cualquier cosa no obvia que vale la pena saber sobre este archivo]
```

## Tono
- Español claro y directo
- Analogías cuando ayuden a entender
- Sin tecnicismos innecesarios
- Si el archivo tiene algo complicado, explicarlo paso a paso
