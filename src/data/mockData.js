// src/data/mockData.js
// Datos de ejemplo separados de App.js para poder testarlos de forma independiente.

export const initialContent = {
  cafeteria: [
    { id: 101, title: "IA y Reclutamiento Ético", duration: "30 min", instructor: "Marta Pérez",
      description: "Explora cómo evitar sesgos algorítmicos.", shortDesc: "Identificación de sesgos.",
      mediaType: "video", mediaUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" },
  ],
  pills: [
    { id: 201, title: "3 trucos de Prompting", duration: "2 min", views: "1.2k",
      description: "Mejora tus mensajes en LinkedIn.", shortDesc: "Triplica tu tasa de respuesta.",
      mediaType: "video", mediaUrl: "#" },
  ],
  structural: [
    { id: 301, title: "Master en IA Generativa", duration: "12h", level: "Experto",
      description: "Curso troncal de Randstad Digital.", shortDesc: "Base estratégica para la consultoría.",
      mediaType: "video", mediaUrl: "#" },
  ],
  externalCerts: [
    { id: 401, title: "AWS Certified AI Practitioner", provider: "Amazon",
      link: "https://aws.amazon.com", description: "Certificación oficial de AWS.",
      shortDesc: "Ruta oficial de Amazon." },
  ],
  forumThreads: [
    { id: 1, title: "¿CÓMO REDACTAR OFERTAS CON CHATGPT?",
      body: "He probado varios prompts y el tono técnico pero cercano funciona genial.",
      user: "ANA M.", avatar: "AM", category: "PRODUCTIVIDAD",
      likes: 15, comments: 2, date: "HOY, 10:30", likedBy: [], replies: [] },
  ],
  activeChallenge: {
    id: 501, title: "OPTIMIZACIÓN DE SCREENING IT CON LLMS",
    objective: "Reducir el tiempo de primer filtrado en un 40%.",
    description: "Crea un prompt que tome un CV y devuelva un JSON.",
    deadline: "VENCE EN 12 DÍAS", rewardPoints: 200,
  },
  pastChallenges: [
    { id: 500, title: "EMAILS DE CAPTACIÓN MAGNÉTICOS", objective: "Mejorar apertura.",
      description: "Secuencia de correos IA.", winner: "MARCOS SOTO", score: 5,
      date: "15 MAR", bestResponse: "Actúa como un reclutador senior..." },
  ],
  ranking: [
    { id: "1",  name: "ANA MARTÍNEZ",     points: 2850, tier: "AI Visionary",  avatar: "AM" },
    { id: "2",  name: "CARLOS PÉREZ",     points: 2420, tier: "AI Strategist", avatar: "CP" },
    { id: "JP", name: "JUAN PÉREZ (TÚ)", points: 1850, tier: "AI Explorer",   avatar: "JP" },
    { id: "3",  name: "MARTA SOTO",       points: 1500, tier: "AI Explorer",   avatar: "MS" },
  ],
};
