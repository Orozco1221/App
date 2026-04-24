# Randstad AI Hub — CLAUDE.md

## Identidad del proyecto
Plataforma interna de Randstad Digital (iniciativa **AI WHISPERS**) para promover la adopción de IA entre empleados.
Audiencia: empleados internos. Todo el texto de la UI va en **español**.
Funcionalidades: Academy, Forum, Ranking, Retos con XP, motor de IA con Gemini.

## Stack tecnológico
- React 18 con **Create React App** (NO Vite, NO Next.js — no eyectar)
- TypeScript strict mode activado
- Supabase JS v2 — base de datos y almacenamiento de archivos
- Google Gemini API — llamadas con `fetch` directo, sin SDK
- Jest + React Testing Library + MSW v2 para mocking
- Tailwind CSS via CDN (no existe `tailwind.config.js`)
- Lucide React para todos los iconos

## Comandos
```
npm start              → servidor dev (puerto 3000)
npm test               → Jest en modo watch
npm run test:coverage  → reporte de cobertura
npm run build          → build de producción (detecta errores TS)
```

## Arquitectura
- `src/lib/supabaseClient.ts` — instancia única de Supabase. Nunca crear otras.
- `src/api/` — todas las llamadas externas (Supabase + Gemini). Componentes y hooks NO llaman a Supabase directamente.
- `src/hooks/` — lógica de negocio (useChallenge, useRanking, useForum, etc.)
- `src/components/` — presentación pura: recibe datos por props, no hace fetching
- `src/constants.ts` — todos los literales y números mágicos del dominio
- `src/data/mockData.ts` — fallback cuando Supabase está vacío (degradación graceful)
- `App.tsx` — gestor de estado central, pasa todo por props, envuelve secciones en `<ErrorBoundary>`

## Conocimiento de dominio (NO deducible del código)
- Categorías Academy (valores exactos en BD): `cafeteria`, `pills`, `structural`, `externalCerts`
- Tiers de XP: AI Beginner (0 pts), AI Explorer (500), AI Strategist (1500), AI Visionary (2500)
- `CURRENT_USER_ID = "JP"` es un placeholder — autenticación real NO implementada
- `callGemini(prompt, systemInstruction)` — siempre proveer `systemInstruction` en español
- Patrón degradación graceful: si Supabase falla → usar mockData, nunca crashear
- Categorías foro (valores exactos en BD): `PRODUCTIVIDAD`, `CONSULTORÍA`, `LEGAL`, `HERRAMIENTAS`
- Storage bucket: `academy-files`, ruta: `{category}/{timestamp}-{filename}`
- Modelo Gemini: `GEMINI_MODEL_NAME` en constants.ts — nunca hardcodear el string

## Reglas arquitectónicas (decisiones ya tomadas)
- Cada sección en App.tsx envuelta en `<ErrorBoundary sectionName="...">` — mantener siempre
- BD usa `snake_case`; TypeScript usa `camelCase` — `mapRowToItem()` hace la conversión
- Todas las queries Supabase van por `src/api/` — nunca inline en componentes ni hooks
- Tests mockean `../../api/gemini` con `jest.mock()` — nunca llamar Gemini real en tests
- TypeScript strict ON — sin `any`, sin `!` non-null (salvo en `supabaseClient.ts` para env vars)

## Qué NO hacer
- No instalar dependencias sin preguntar antes
- No crear nuevos clientes Supabase — usar el singleton
- No escribir texto de UI en inglés
- No usar `dangerouslySetInnerHTML`
- No exponer env vars en console.log ni en código fuente

## Memoria al final de cada conversación
Al terminar cada sesión, revisar si hay algo relevante que guardar en memoria (`~/.claude/projects/.../memory/`).
Si `MEMORY.md` supera 200 líneas, ejecutar la skill `anthropic-skills:consolidate-memory`.
Actualizar o eliminar memorias que hayan quedado desactualizadas.
