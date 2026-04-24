# Randstad Digital — AI Hub Adopcion

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9.5-3178c6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-2.x-3ecf8e.svg)](https://supabase.com/)
[![Version](https://img.shields.io/badge/version-1.0.0-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-59%20passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Descripcion del proyecto

**AI Hub Adopcion** es una plataforma interna de Randstad Digital (iniciativa **AI WHISPERS**) para acelerar la adopcion de Inteligencia Artificial Generativa entre los equipos de la compania. Combina formacion modular, gamificacion con puntos XP y evaluacion automatica por IA para motivar a los empleados a integrar la IA en su dia a dia.

---

## Funcionalidades principales

### 1. Academy — gestion de contenidos
Contenidos organizados en 4 categorias: **CafeterIA** (sesiones de 30 min), **TikTok Learning** (videos rapidos), **Estructurales** (conocimiento core) y **Certificaciones** (formacion de mercado). Incluye Smart Tools generados con Gemini: Resumidor, Tutor IA y Smart Quiz.

### 2. AI Challenges — evaluador de competencias
Retos de prompting evaluados en tiempo real por Gemini 2.5 Flash. El sistema puntua cada submission y da feedback detallado automaticamente.

### 3. Foro de comunidad
Espacio tecnico con categorias (Productividad, Consultoria, Legal, Herramientas), sistema de likes, comentarios y filtros. Incluye AI Mentor para consejos personalizados de mejora.

### 4. Ranking y gamificacion
Sistema de XP con 4 tiers dinamicos: AI Beginner, AI Explorer, AI Strategist y AI Visionary. Tabla de clasificacion global actualizada en tiempo real.

---

## Stack tecnologico

| Tecnologia | Version | Uso |
| :--- | :---: | :--- |
| **React** | 18.2 | Biblioteca principal de UI (SPA) |
| **TypeScript** | 4.9.5 | Tipado estatico estricto en todo el proyecto |
| **Supabase JS** | 2.x | Base de datos PostgreSQL y almacenamiento de archivos |
| **Google Gemini API** | 2.5 Flash | Motor de IA para evaluacion y smart tools |
| **Tailwind CSS** | CDN | Estilos utility-first, diseno responsive |
| **Lucide React** | 0.292 | Iconos vectoriales |
| **Jest + RTL** | — | Tests unitarios y de hooks |
| **MSW** | 2.x | Mocking de APIs en tests |

---

## Instalacion

```bash
git clone https://github.com/Orozco1221/App.git
cd App
npm install
cp .env.example .env
# Abre .env y rellena las claves:
#   REACT_APP_SUPABASE_URL=tu_url
#   REACT_APP_SUPABASE_ANON_KEY=tu_clave
#   REACT_APP_GEMINI_KEY=tu_clave_gemini
npm start
```

---

## Tests

```bash
npm test                  # modo watch
npm run test:coverage     # reporte de cobertura
```

### Cobertura actual (v1.0.0) — 59 tests

| Suite | Tests | Que verifica |
| :--- | :---: | :--- |
| constants.test.ts | 8 | Valores centralizados y tiers de XP |
| mockData.test.ts | 6 | Estructura de datos de fallback |
| likeThread.test.ts | 5 | Logica pura de likes en el foro |
| parseEvaluation.test.ts | 5 | Parseo JSON de respuestas de Gemini |
| gemini.test.ts | 6 | Cliente de la API de Gemini |
| useChallenge.test.ts | 8 | Hook de retos con evaluacion IA |
| useRanking.test.ts | 8 | Hook de ranking y calculo de tiers |
| useForum.test.ts | 9 | Hook del foro con likes y filtros |
| ErrorBoundary.test.ts | 4 | Captura de errores en componentes |
| **Total** | **59** | |

---

## Estructura del proyecto

```
randstad-ai-hub/
├── CLAUDE.md                    # Configuracion de Claude Code (cerebro del proyecto)
├── .claude/
│   ├── agents/                  # Agentes especializados (backend, frontend, testing...)
│   ├── commands/                # Slash commands (/review-pr, /check-security...)
│   ├── rules/                   # Reglas por tipo de archivo (TypeScript, React, Supabase...)
│   └── skills/                  # Flujos de trabajo reutilizables
├── src/
│   ├── api/
│   │   ├── academyApi.ts        # CRUD de contenidos con Supabase
│   │   └── gemini.ts            # Cliente de Google Gemini API
│   ├── components/
│   │   ├── Academy.tsx
│   │   ├── AddMaterialModal.tsx
│   │   ├── Challenges.tsx
│   │   ├── ContentViewer.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── Forum.tsx
│   │   ├── Ranking.tsx
│   │   └── ScrollReveal.tsx
│   ├── data/mockData.ts         # Datos de fallback cuando Supabase esta vacio
│   ├── hooks/
│   │   ├── useChallenge.ts
│   │   ├── useForum.ts
│   │   └── useRanking.ts
│   ├── lib/
│   │   └── supabaseClient.ts    # Singleton del cliente Supabase
│   ├── utils/
│   │   ├── likeThread.ts
│   │   └── parseEvaluation.ts
│   ├── App.tsx
│   ├── constants.ts             # Todos los literales y valores de dominio
│   └── setupTests.ts
├── .env.example
└── package.json
```

---

## Historial de versiones

| Version | Descripcion |
| :--- | :--- |
| **v1.0.0** | Primera version estable. App completa con Supabase, TypeScript y workspace de Claude Code configurado |
| **v0.5.0** | Migracion completa a TypeScript (todos los archivos .ts/.tsx) |
| **v0.4.0** | Integracion con Supabase para persistencia + ContentViewer modal |
| **v0.3.0** | PropTypes en 5 componentes + ErrorBoundary + accesibilidad (59 tests) |
| **v0.2.0** | Hooks custom: useChallenge, useRanking, useForum |
| **v0.1.0** | Tests de funciones criticas: likeThread, parseEvaluation, callGemini |
| **v0.0.1** | Version inicial: Academy, Foro, Retos, Ranking |

---

## Roadmap

- [ ] Autenticacion real con Supabase Auth (SSO con cuenta Randstad)
- [ ] Backend seguro: mover llamadas a la API de Gemini a un servidor Node.js
- [ ] Dashboard de administracion para subir materiales y ver metricas
- [ ] Persistencia completa del foro y ranking en Supabase
- [ ] Notificaciones cuando un usuario sube de tier

---

Desarrollado como iniciativa interna para la transformacion digital en Randstad Digital — **AI WHISPERS**.
