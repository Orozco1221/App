# Randstad Digital - AI Hub Adopcion

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Version](https://img.shields.io/badge/version-0.3.0-brightgreen.svg)]()
[![Tests](https://img.shields.io/badge/tests-55%20passing-brightgreen.svg)]()
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## Descripcion del proyecto

**AI Hub Adopcion** es una plataforma integral de capacitacion y gamificacion disenada para acelerar la adopcion de Inteligencia Artificial Generativa dentro de los equipos de Randstad Digital.

El proyecto combina un sistema de gestion de aprendizaje (LMS) con herramientas de IA en tiempo real para evaluar competencias, resolver dudas y dinamizar la comunidad interna mediante mecanicas de juego (XP, Rankings y Retos).

---

## Funcionalidades principales

### 1. Academy (gestion de contenidos)
- Categorizacion modular en 4 niveles: CafeterIA, TikTok Learning, Estructurales y Certificaciones.
- Smart Tools: Resumidor, Tutor IA y Smart Quiz generados con Gemini.

### 2. AI Challenges (evaluador de competencias)
- Juez automatico: prompts evaluados al instante por Gemini 2.5 Flash.
- Historico de respuestas de oro.

### 3. Comunidad y gamificacion
- Foro tecnico con likes, comentarios y filtros.
- Ranking global con XP y Tiers dinamicos.
- AI Mentor: consejos personalizados para escalar en el ranking.

---

## Stack tecnologico

| Tecnologia | Uso |
| :--- | :--- |
| **React.js 18** | Biblioteca principal de UI (SPA) |
| **Tailwind CSS** | Estilos utility-first, diseno responsive |
| **Lucide React** | Iconos vectoriales |
| **Google Gemini API** | Motor de IA (gemini-2.5-flash-preview-09-2025) |
| **Jest + React Testing Library** | Tests unitarios y de hooks |
| **Intersection Observer API** | Animaciones de scroll (ScrollReveal) |

---

## Instalacion

```bash
git clone https://github.com/Orozco1221/App.git
cd App
npm install
cp .env.example .env
# Abre .env y pega tu clave en REACT_APP_GEMINI_KEY
npm start
```

---

## Tests

```bash
npm test
npm run test:coverage
```

### Cobertura actual (v0.3.0)

| Suite | Tests | Que verifica |
| :--- | :---: | :--- |
| constants.test.js | 8 | Valores centralizados y sus tipos |
| mockData.test.js | 6 | Estructura de los datos de ejemplo |
| likeThread.test.js | 5 | Logica pura de likes |
| parseEvaluation.test.js | 5 | Parseo JSON de Gemini |
| gemini.test.js | 6 | Cliente de la API de Gemini |
| useChallenge.test.js | 8 | Hook de retos |
| useRanking.test.js | 8 | Hook de ranking |
| useForum.test.js | 9 | Hook del foro |
| **Total** | **55** | |

---

## Estructura del proyecto

```
randstad-ai-hub/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   ├── gemini.js
│   │   └── __tests__/gemini.test.js
│   ├── components/
│   │   ├── Academy.js
│   │   ├── AddMaterialModal.js
│   │   ├── Challenges.js
│   │   ├── Forum.js
│   │   ├── Ranking.js
│   │   └── ScrollReveal.js
│   ├── data/
│   │   └── mockData.js
│   ├── hooks/
│   │   ├── useChallenge.js
│   │   ├── useForum.js
│   │   ├── useRanking.js
│   │   └── __tests__/
│   │       ├── useChallenge.test.js
│   │       ├── useForum.test.js
│   │       └── useRanking.test.js
│   ├── utils/
│   │   ├── likeThread.js
│   │   ├── parseEvaluation.js
│   │   └── __tests__/
│   │       ├── likeThread.test.js
│   │       └── parseEvaluation.test.js
│   ├── __tests__/
│   │   ├── constants.test.js
│   │   └── mockData.test.js
│   ├── App.js
│   ├── constants.js
│   ├── index.js
│   └── setupTests.js
├── .env.example
├── package.json
└── README.md
```

---

## Historial de versiones

| Version | Descripcion |
| :--- | :--- |
| **v0.3.0** | Hooks custom: useChallenge, useRanking, useForum (55 tests) |
| **v0.2.0** | Tests de funciones criticas: likeThread, parseEvaluation, callGemini |
| **v0.1.0** | Fundamentos TDD: constantes, mockData, setup de tests |
| **v0.0.1** | Version inicial: Academy, Foro, Retos, Ranking |

---

## Roadmap

- [ ] **v0.4.0** - PR #4: PropTypes + ErrorBoundary + accesibilidad
- [ ] Persistencia: Integracion con Supabase para base de datos y autenticacion SSO.
- [ ] Backend seguro: Mover las llamadas a la API a un servidor Node.js.
- [ ] Dashboard de admin: Interfaz para que RRHH suba materiales y vea metricas.
- [ ] Multilenguaje: Soporte para diferentes regiones de la compania.

---

Desarrollado como iniciativa personal para la transformacion digital en Randstad Digital.
