# App
Desarrollo de una aplicación para desplegar en vercer que será usada para compañia
# Randstad Digital - AI Hub Adopción 🚀

## 📋 Descripción del Proyecto
**AI Hub Adopción** es una plataforma integral de capacitación y gamificación diseñada para acelerar la adopción de Inteligencia Artificial Generativa dentro de los equipos de Randstad Digital. 

El proyecto combina un sistema de gestión de aprendizaje (LMS) con herramientas de IA en tiempo real para evaluar competencias, resolver dudas y dinamizar la comunidad interna mediante mecánicas de juego (XP, Rankings y Retos).

---

## ✨ Funcionalidades Principales (Core)

### 1. Academy (Gestión de Contenidos)
- **Categorización Modular:** Estructura en 4 niveles: CafeterIA (expertos), TikTok Learning (píldoras), Estructurales y Certificaciones Externas.
- **Smart Tools por IA:** - **Resumidor:** Generación de puntos clave automáticos.
  - **Tutor IA:** Chat interactivo contextualizado al curso.
  - **Smart Quiz:** Generación dinámica de exámenes mediante LLM.

### 2. AI Challenges (Evaluador de Competencias)
- **Juez Técnico Automático:** Los usuarios entregan soluciones (prompts) que son evaluadas instantáneamente por **Gemini 2.5 Flash**, devolviendo un score JSON y feedback cualitativo.
- **Histórico de "Respuestas de Oro":** Repositorio de las mejores prácticas ganadoras.

### 3. Comunidad y Gamificación
- **Foro Técnico:** Hilos de discusión con gestión de estado para comentarios, likes y edición.
- **Ranking Global:** Sistema de puntos de experiencia (XP) y Tiers dinámicos (AI Visionary, Strategist, etc.).
- **AI Mentor:** Asistente que analiza la posición del usuario en el ranking y ofrece consejos para escalar posiciones.

---

## 🛠️ Stack Tecnológico

| Tecnología | Uso |
| :--- | :--- |
| **React.js** | Biblioteca principal de UI (SPA) |
| **Tailwind CSS** | Framework de estilos utility-first (Diseño Responsive) |
| **Lucide React** | Pack de iconos vectoriales |
| **Google Gemini API** | Motor de IA (Modelo: `gemini-2.5-flash-preview-09-2025`) |
| **Intersection Observer API** | Animaciones de scroll mediante el componente `ScrollReveal` |

---

## 🚀 Instalación y Uso

1. **Clonar el repositorio:**
   ```bash
   git clone [url-del-repo]
Instalar dependencias:

Bash
npm install
Configurar API Key:
Localiza la constante apiKey en App.js y pega tu clave de Google AI Studio.
(Nota: En producción, se recomienda mover esto a un archivo .env o un Proxy/Backend).

Iniciar el servidor de desarrollo:

Bash
npm start
🏗️ Arquitectura del Código
El código sigue una estructura de Componente Único Funcional para este MVP, priorizando la legibilidad y la rapidez de iteración:

Gestión de Estado: Uso intensivo de useState y useEffect para la reactividad de la UI.

Persistencia Simulada: Se utiliza un objeto content centralizado (Mock Data) que permite una migración sencilla a una base de datos real (PostgreSQL/MongoDB).

Lógica de Reintento: Implementación de Exponential Backoff en la función callGemini para manejar límites de cuota o errores de red.

🎯 Próximos Pasos (Roadmap)
[ ] Persistencia: Integración con Firebase o Supabase para base de datos y autenticación (SSO Empresa).

[ ] Backend de Seguridad: Mover las llamadas a la API a un servidor Node.js para proteger la API Key.

[ ] Dashboard de Admin: Interfaz para que RRHH pueda subir nuevos materiales y ver métricas de adopción.

[ ] Multilenguaje: Soporte completo para diferentes regiones de la compañía.

Desarrollado como iniciativa personal para la transformación digital en Randstad Digital.
