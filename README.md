# Randstad Digital - AI Hub Adopción 🚀

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Descripción del Proyecto

**AI Hub Adopción** es una plataforma integral de capacitación y gamificación diseñada para acelerar la adopción de Inteligencia Artificial Generativa dentro de los equipos de Randstad Digital. 

El proyecto combina un sistema de gestión de aprendizaje (LMS) con herramientas de IA en tiempo real para evaluar competencias, resolver dudas y dinamizar la comunidad interna mediante mecánicas de juego (XP, Rankings y Retos).

---

## ✨ Funcionalidades Principales

### 1. Academy (Gestión de Contenidos)
- **Categorización Modular:** Estructura en 4 niveles: CafeterIA (expertos), TikTok Learning (píldoras), Estructurales y Certificaciones Externas.
- **Smart Tools por IA:**
  - **Resumidor:** Generación de puntos clave automáticos.
  - **Tutor IA:** Chat interactivo contextualizado al curso.
  - **Smart Quiz:** Generación dinámica de exámenes mediante LLM.

### 2. AI Challenges (Evaluador de Competencias)
- **Juez Técnico Automático:** Los usuarios entregan soluciones (prompts) que son evaluadas instantáneamente por **Gemini 2.5 Flash**, devolviendo un score JSON y feedback cualitativo.
- **Histórico de "Respuestas de Oro":** Repositorio de las mejores prácticas ganadoras.

### 3. Comunidad y Gamificación
- **Foro Técnico:** Hilos de discusión con gestión de estado para comentarios, likes y edición.
- **Ranking Global:** Sistema de puntos de experiencia (XP) y Tiers dinámicos (AI Visionary, Strategist, etc.).
- **AI Mentor:** Asistente que analiza la posición del usuario en el ranking y ofrece consejos para escalar posiciones.

### 4. Otras Características
- **Animaciones de Scroll:** Usando Intersection Observer API para revelaciones suaves.
- **Interfaz Responsiva:** Diseñada con Tailwind CSS para una experiencia óptima en dispositivos móviles y desktop.
- **Pruebas Automatizadas:** Cobertura de pruebas con Jest y React Testing Library.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
| :--- | :--- |
| **React.js** | Biblioteca principal de UI (SPA) |
| **Tailwind CSS** | Framework de estilos utility-first (Diseño Responsive) |
| **Lucide React** | Pack de iconos vectoriales |
| **Google Gemini API** | Motor de IA (Modelo: `gemini-2.5-flash-preview-09-2025`) |
| **Intersection Observer API** | Animaciones de scroll mediante el componente `ScrollReveal` |
| **Jest & React Testing Library** | Framework de pruebas |
| **MSW (Mock Service Worker)** | Mocking de APIs para pruebas |

---

## 📋 Prerrequisitos

- **Node.js** versión 18 o superior
- **npm** o **yarn** para gestión de paquetes
- Una clave de API de **Google AI Studio** para Gemini

---

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone [url-del-repo]
   cd randstad-ai-hub
   ```

2. **Instala las dependencias:**
   ```bash
   npm install
   ```

3. **Configura las variables de entorno:**
   - Copia el archivo `.env.example` a `.env`:
     ```bash
     cp .env.example .env
     ```
   - Abre `.env` y pega tu clave de API de Google AI Studio en `REACT_APP_GEMINI_KEY`.

---

## ⚙️ Configuración

- **API Key:** Asegúrate de que `REACT_APP_GEMINI_KEY` esté configurada correctamente. En producción, considera mover esto a un backend seguro.
- **Puerto de Desarrollo:** La aplicación se ejecuta en `http://localhost:3000` por defecto.

---

## 📖 Uso

1. **Inicia el servidor de desarrollo:**
   ```bash
   npm start
   ```

2. Abre tu navegador y ve a `http://localhost:3000`.

3. Explora las secciones: Academy, Challenges, Forum, Ranking, etc.

---

## 🧪 Pruebas

Ejecuta las pruebas con:
```bash
npm test
```

Para ver la cobertura de pruebas:
```bash
npm run test:coverage
```

Las pruebas incluyen:
- Pruebas unitarias para componentes
- Pruebas de integración para la API de Gemini
- Mocking de datos con MSW

---

## 📁 Estructura del Proyecto

```
randstad-ai-hub/
├── public/
│   └── index.html          # Archivo HTML principal
├── src/
│   ├── api/
│   │   └── gemini.js       # Integración con Google Gemini API
│   ├── components/
│   │   ├── Academy.js      # Componente de Academia
│   │   ├── AddMaterialModal.js  # Modal para agregar materiales
│   │   ├── Challenges.js   # Componente de Desafíos
│   │   ├── Forum.js        # Componente de Foro
│   │   ├── Ranking.js      # Componente de Ranking
│   │   └── ScrollReveal.js # Animaciones de scroll
│   ├── data/
│   │   └── mockData.js     # Datos simulados
│   ├── __tests__/
│   │   ├── constants.test.js
│   │   └── mockData.test.js
│   ├── App.js              # Componente principal
│   ├── constants.js        # Constantes de la aplicación
│   ├── index.js            # Punto de entrada
│   └── setupTests.js       # Configuración de pruebas
├── .env.example            # Ejemplo de variables de entorno
├── package.json            # Dependencias y scripts
└── README.md               # Este archivo
```

---

## 📜 Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm test`: Ejecuta las pruebas en modo interactivo
- `npm run test:coverage`: Ejecuta las pruebas y genera reporte de cobertura

---

## 🎯 Roadmap

- [ ] **Persistencia:** Integración con Firebase o Supabase para base de datos y autenticación (SSO Empresa).
- [ ] **Backend de Seguridad:** Mover las llamadas a la API a un servidor Node.js para proteger la API Key.
- [ ] **Dashboard de Admin:** Interfaz para que RRHH pueda subir nuevos materiales y ver métricas de adopción.
- [ ] **Multilenguaje:** Soporte completo para diferentes regiones de la compañía.
- [ ] **Optimizaciones:** Implementar lazy loading, code splitting y PWA features.

---

## 🤝 Contribuyendo

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

Desarrollado como iniciativa personal para la transformación digital en Randstad Digital.