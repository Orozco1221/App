import React, { useState } from 'react';
import { BookOpen, MessageCircle, Trophy, BarChart3, X, PlayCircle, FileText, ExternalLink, Eye, Share2, Sparkles, Loader2, Bot, Send, Paperclip } from 'lucide-react';

// Importaciones de nuestros módulos refactorizados
import { callGemini } from './api/gemini';
import Academy from './components/Academy';
import Forum from './components/Forum';
import Challenges from './components/Challenges';
import Ranking from './components/Ranking';

const CURRENT_USER_ID = "JP";

const App = () => {
  // --- ESTADOS DE NAVEGACIÓN Y MODALES ---
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [selectedPastChallenge, setSelectedPastChallenge] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddThreadModal, setShowAddThreadModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);

  // --- ESTADOS DE IA Y DATOS ---
  const [forumCategory, setForumCategory] = useState('trending');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState("");
  const [aiChat, setAiChat] = useState([]);
  const [submissionText, setSubmissionText] = useState("");
  const [evaluation, setEvaluation] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [showAllRanking, setShowAllRanking] = useState(false);
  const [aiQuiz, setAiQuiz] = useState(null);
  const [mentorResponse, setMentorResponse] = useState("");

  // --- BASE DE DATOS LOCAL SIMULADA (MOCK DATA) ---
  const [content, setContent] = useState({
    cafeteria: [
      { id: 101, title: 'IA y Reclutamiento Ético', duration: '30 min', instructor: 'Marta Pérez', description: 'Explora cómo evitar sesgos algorítmicos.', shortDesc: 'Identificación de sesgos en algoritmos.', mediaType: 'video', mediaUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
    pills: [
      { id: 201, title: '3 trucos de Prompting', duration: '2 min', views: '1.2k', description: 'Mejora tus mensajes en LinkedIn.', shortDesc: 'Triplica tu tasa de respuesta.', mediaType: 'video', mediaUrl: '#' },
    ],
    structural: [
      { id: 301, title: 'Master en IA Generativa', duration: '12h', level: 'Experto', description: 'Curso troncal de Randstad Digital.', shortDesc: 'Base estratégica para la consultoría.', mediaType: 'video', mediaUrl: '#' },
    ],
    externalCerts: [
      { id: 401, title: 'AWS Certified AI Practitioner', provider: 'Amazon', link: 'https://aws.amazon.com', description: 'Certificación oficial AWS.', shortDesc: 'Ruta oficial de Amazon.' },
    ],
    forumThreads: [
      { id: 1, title: '¿CÓMO REDACTAR OFERTAS CON CHATGPT?', body: 'He probado varios prompts y el tono "técnico pero cercano" funciona genial.', user: 'ANA M.', avatar: 'AM', category: 'PRODUCTIVIDAD', likes: 15, comments: 2, date: 'HOY, 10:30', likedBy: [], replies: [] },
    ],
    activeChallenge: {
      id: 501, title: "OPTIMIZACIÓN DE SCREENING IT CON LLMS", objective: "Reducir el tiempo de primer filtrado en un 40%.", description: "Crea un prompt que tome un CV y devuelva un JSON.", deadline: "VENCE EN 12 DÍAS", rewardPoints: 200
    },
    pastChallenges: [
      { id: 500, title: "EMAILS DE CAPTACIÓN MAGNÉTICOS", objective: "Mejorar apertura", description: "Secuencia de correos IA.", winner: "MARCOS SOTO", score: 5, date: "15 MAR", bestResponse: "Actúa como un reclutador senior..." }
    ],
    ranking: [
      { id: '1', name: 'ANA MARTÍNEZ', points: 2850, tier: 'AI Visionary', avatar: 'AM' },
      { id: '2', name: 'CARLOS PÉREZ', points: 2420, tier: 'AI Strategist', avatar: 'CP' },
      { id: 'JP', name: 'JUAN PÉREZ (TÚ)', points: 1850, tier: 'AI Explorer', avatar: 'JP' },
      { id: '3', name: 'MARTA SOTO', points: 1500, tier: 'AI Explorer', avatar: 'MS' },
    ]
  });

  // --- DERIVADOS DEL RANKING ---
  const sortedRanking = [...content.ranking].sort((a, b) => b.points - a.points).map((u, i) => ({...u, position: i+1}));
  const myIndex = sortedRanking.findIndex(u => u.id === CURRENT_USER_ID);
  const podiumUsers = sortedRanking.slice(0, 3);
  const getDisplayRanking = () => showAllRanking ? sortedRanking : sortedRanking.slice(Math.max(0, myIndex - 2), Math.min(sortedRanking.length, myIndex + 3));

  // --- FUNCIONES IA ---
  const evaluateChallenge = async () => {
    if (!submissionText.trim()) return;
    setIsEvaluating(true);
    const res = await callGemini(`Evalúa: ${submissionText}`, `Juez Senior Randstad. JSON: {"score": number, "feedback": string}`);
    try { setEvaluation(JSON.parse(res.replace(/```json|```/g, "").trim())); } 
    catch (e) { setEvaluation({ score: 3, feedback: "Evaluación completada." }); }
    setIsEvaluating(false);
  };

  const askMentor = async () => {
    setIsAiLoading(true);
    const res = await callGemini(`Mi puesto actual es #${sortedRanking[myIndex].position} con ${sortedRanking[myIndex].points} XP. Dame consejos para subir.`, "Mentor Randstad IA.");
    setMentorResponse(res);
    setIsAiLoading(false);
  };

  const likeThread = (id) => {
    setContent(prev => ({
      ...prev,
      forumThreads: prev.forumThreads.map(t => {
        if (t.id === id) {
          const hasLiked = t.likedBy.includes(CURRENT_USER_ID);
          return { ...t, likes: hasLiked ? t.likes - 1 : t.likes + 1, likedBy: hasLiked ? t.likedBy.filter(u => u !== CURRENT_USER_ID) : [...t.likedBy, CURRENT_USER_ID] };
        }
        return t;
      })
    }));
  };

  // --- COMPONENTES UI AUXILIARES ---
  const NavItem = ({ id, icon: Icon, label }) => (
    <button onClick={() => setActiveTab(id)} className={`flex flex-col items-center p-3 transition-all ${activeTab === id ? 'text-[#3b82f6] border-b-2 border-[#3b82f6] font-black' : 'text-[#94a3b8] hover:text-[#3b82f6]'}`}>
      <Icon size={24} />
      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      
      {/* HEADER FIJO */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-black">R</div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">RANDSTAD DIGITAL</h1>
            <p className="text-[10px] text-[#3b82f6] font-black uppercase mt-1 tracking-widest leading-none">AI HUB ADOPCIÓN</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3b82f6] font-black shadow-xl ring-1 ring-slate-100 uppercase">JP</div>
        </div>
      </header>

      {/* RENDERIZADO DINÁMICO DE PESTAÑAS */}
      <main className="flex-grow max-w-6xl mx-auto w-full px-6 pt-4 pb-40 text-[#1e2b7a]">
        {activeTab === 'courses' && (
          <Academy content={content} setSelectedItem={setSelectedItem} setTargetCategory={setTargetCategory} setShowAddModal={setShowAddModal} />
        )}
        
        {activeTab === 'forum' && (
          <Forum forumThreads={content.forumThreads} forumCategory={forumCategory} setForumCategory={setForumCategory} setSelectedThreadId={setSelectedThreadId} likeThread={likeThread} CURRENT_USER_ID={CURRENT_USER_ID} setShowAddThreadModal={setShowAddThreadModal} />
        )}
        
        {activeTab === 'challenges' && (
          <Challenges activeChallenge={content.activeChallenge} pastChallenges={content.pastChallenges} submissionText={submissionText} setSubmissionText={setSubmissionText} evaluateChallenge={evaluateChallenge} isEvaluating={isEvaluating} evaluation={evaluation} setEvaluation={setEvaluation} setSelectedPastChallenge={setSelectedPastChallenge} />
        )}
        
        {activeTab === 'ranking' && (
          <Ranking sortedRanking={sortedRanking} myIndex={myIndex} podiumUsers={podiumUsers} getDisplayRanking={getDisplayRanking} showAllRanking={showAllRanking} setShowAllRanking={setShowAllRanking} askMentor={askMentor} isAiLoading={isAiLoading} mentorResponse={mentorResponse} CURRENT_USER_ID={CURRENT_USER_ID} />
        )}
      </main>

      {/* BARRA DE NAVEGACIÓN INFERIOR */}
      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-40">
        <div className="bg-white/90 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-2.5 flex justify-around items-center">
          <NavItem id="courses" icon={BookOpen} label="ACADEMY" />
          <NavItem id="forum" icon={MessageCircle} label="COMUNIDAD" />
          <NavItem id="challenges" icon={Trophy} label="RETOS" />
          <NavItem id="ranking" icon={BarChart3} label="RANKING" />
        </div>
      </nav>

    </div>
  );
};

export default App;
