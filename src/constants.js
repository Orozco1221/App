// src/constants.js
// Valores centralizados — antes estaban "hardcodeados" por toda la app.

export const CURRENT_USER_ID = "JP";
export const GEMINI_MODEL_NAME = "gemini-2.5-flash-preview-09-2025";
export const GEMINI_MAX_RETRIES = 5;
export const DEFAULT_ITEM_POINTS = 50;

export const ACADEMY_CATEGORIES = [
  { key: "cafeteria",    label: "CafeterIA",       description: "Inspiración de 30 min para expertos", color: "amber"  },
  { key: "pills",        label: "TikTok Learning",  description: "Vídeos rápidos con impacto real",     color: "purple" },
  { key: "structural",   label: "Estructurales",    description: "Conocimiento Core Randstad",           color: "blue"   },
  { key: "externalCerts",label: "Certificaciones",  description: "Formación recomendada de mercado",     color: "green"  },
];

export const RANKING_TIERS = [
  { name: "AI Beginner",    minPoints: 0    },
  { name: "AI Explorer",    minPoints: 500  },
  { name: "AI Strategist",  minPoints: 1500 },
  { name: "AI Visionary",   minPoints: 2500 },
];

export const FORUM_CATEGORIES = ["PRODUCTIVIDAD", "CONSULTORÍA", "LEGAL", "HERRAMIENTAS"];
export const FORUM_FILTERS    = ["trending", "new", "vistos"];
