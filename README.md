# Randstad Digital — AI Hub Adopción

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Version](https://img.shields.io/badge/version-0.2.0-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-30%20passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Descripción del proyecto

**AI Hub Adopción** es una plataforma integral de capacitación y gamificación diseñada para acelerar la adopción de Inteligencia Artificial Generativa dentro de los equipos de Randstad Digital.

El proyecto combina un sistema de gestión de aprendizaje (LMS) con herramientas de IA en tiempo real para evaluar competencias, resolver dudas y dinamizar la comunidad interna mediante mecánicas de juego (XP, Rankings y Retos).

---

## Funcionalidades principales

### 1. Academy (gestión de contenidos)
- **Categorización modular:** Estructura en 4 niveles: CafeterIA (expertos), TikTok Learning (píldoras), Estructurales y Certificaciones Externas.
- **Smart Tools por IA:** Resumidor, Tutor IA y Smart Quiz generados dinámicamente con Gemini.

### 2. AI Challenges (evaluador de competencias)
- **Juez automático:** Los usuarios entregan prompts que son evaluados al instante por Gemini 2.5 Flash, devolviendo un score y feedback cualitativo.
- **Histórico de respuestas de oro:** Repositorio de las mejores prácticas ganadoras.

### 3. Comunidad y gamificación
- **Foro técnico:** Hilos de discusión con likes, comentarios y filtros.
- **Ranking global:** Sistema de XP y Tiers dinámicos (AI Visionary, Strategist, Explorer, Beginner).
- **AI Mentor:** Asistente que analiza la posición del usuario y ofrece consejos para escalar.

---

## Stack tecnológico

| Tecnología | Uso |
| :--- | :--- |
| **React.js 18** | Biblioteca principal de UI (SPA) |
| **Tailwind CSS** | Estilos utility-first, diseño responsive |
| **Lucide React** | Pack de iconos vectoriales |
| **Google Gemini API** | Motor de IA (`gemini-2.5-flash-preview-09-2025`) |
| **Jest + React Testing Library** | Framework de tests unitarios |
| **Intersection Observer API** | Animaciones de scroll (ScrollReveal) |

---

## Prerrequisitos

- **Node.js** v18 o superior
- **npm** para gestión de paquetes
- Una clave de API de **Google AI Studio** para Gemini

---

## Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/Orozco1221/App.git
cd App

# 2. Instala las dependencias
npm install

# 3. Configura las variables de entorno
cp .env.example .env
# Abre .env y pega tu clave en REACT_APP_GEMINI_KEY

# 4. Inicia el servidor de desarrollo
npm start
```

---

## Tests

```bash
# Ejecutar todos los tests
npm test

# Ver informe de cobertura
npm run test:coverage
```

### Cobertura actual (v0.2.0)

| Suite | Tests | Qué verifica |
| :--- | :---: | :--- |
| `constants.test.js` | 8 | Valores centralizados y sus tipos |
| `mockData.test.js` | 6 | Estructura de los datos de ejemplo |
| `likeThread.test.js` | 5 | Dar like, quitar like, idempotencia, aislamiento |
| `parseEvaluation.test.js` | 5 | Parseo JSON, markdown, fallback, score fuera de rango |
| `gemini.test.js` | 6 | Sin API key, respuesta ok, body, error de red, system instruction |
| **Total** | **30** | |

---

## Estructura del proyecto

```
randstad-ai-hub/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   ├── gemini.js                  # Cliente de Google Gemini API
│   │   └── __tests__/
│   │       └── gemini.test.js         # Tests de callGemini()
│   ├── components/
│   │   ├── Academy.js
│   │   ├── AddMaterialModal.js
│   │   ├── Challenges.js
│   │   ├── Forum.js
│   │   ├── Ranking.js
│   │   └── ScrollReveal.js
│   ├── data/
│   │   └── mockData.js                # Datos de ejemplo separados
│   ├── utils/
│   │   ├── likeThread.js              # Lógica pura de likes del foro
│   │   ├── parseEvaluation.js         # Parseo de respuestas de Gemini
│   │   └── __tests__/
│   │       ├── likeThread.test.js
│   │       └── parseEvaluation.test.js
│   ├── __tests__/
│   │   ├── constants.test.js
│   │   └── mockData.test.js
│   ├── App.js                         # Componente raíz y orquestador
│   ├── constants.js                   # Valores centralizados
│   ├── index.js
│   └── setupTests.js
├── .env.example
├── package.json
└── README.md
```

---

## Scripts disponibles

| Comando | Qué hace |
| :--- | :--- |
| `npm start` | Inicia el servidor de desarrollo en localhost:3000 |
| `npm run build` | Construye la app para producción |
| `npm test` | Ejecuta los tests en modo interactivo |
| `npm run test:coverage` | Ejecuta tests y genera informe de cobertura |

---

## Historial de versiones

| Versión | Descripción |
| :--- | :--- |
| **v0.2.0** | Tests de funciones críticas: `likeThread`, `parseEvaluation`, `callGemini` (30 tests) |
| **v0.1.0** | Fundamentos TDD: constantes centralizadas, mockData separado, setup de tests |
| **v0.0.1** | Versión inicial: Academy, Foro, Retos, Ranking con Gemini |

---

## Roadmap

- [ ] **v0.3.0** — PR #3: Hooks custom (`useChallenge`, `useRanking`, `useForum`)
- [ ] **v0.4.0** — PR #4: PropTypes + ErrorBoundary + accesibilidad
- [ ] **Persistencia:** Integración con Supabase para base de datos y autenticación SSO.
- [ ] **Backend seguro:** Mover las llamadas a la API a un servidor Node.js para proteger la API key.
- [ ] **Dashboard de admin:** Interfaz para que RRHH suba materiales y vea métricas.
- [ ] **Multilenguaje:** Soporte para diferentes regiones de la compañía.

---

Desarrollado como iniciativa personal para la transformación digital en Randstad Digital.
