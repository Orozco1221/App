import React, { useState } from 'react';
import { BookOpen, MessageCircle, Trophy, BarChart3 } from 'lucide-react';

import { callGemini } from './api/gemini';
import Academy from './components/Academy';
import Forum from './components/Forum';
import Challenges from './components/Challenges';
import Ranking from './components/Ranking';
import AddMaterialModal from './components/AddMaterialModal';

// PR #1: constantes y datos centralizados
import { CURRENT_USER_ID, DEFAULT_ITEM_POINTS } from './constants';
import { initialContent } from './data/mockData';

// PR #2: funciones puras extraídas para ser testeables
import { likeThread as likeThreadFn } from './utils/likeThread';
import { parseEvaluation } from './utils/parseEvaluation';

const App = () => {
  const [activeTab, setActiveTab] = useState('courses');
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedThreadId, setSelectedThreadId] = useState(null);
  const [selectedPastChallenge, setSelectedPastChallenge] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddThreadModal, setShowAddThreadModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState(null);
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
  const [content, setContent] = useState(initialContent);

  const sortedRanking = [...content.ranking]
    .sort((a, b) => b.points - a.points)
    .map((u, i) => ({ ...u, position: i + 1 }));
  const myIndex = sortedRanking.findIndex(u => u.id === CURRENT_USER_ID);
  const podiumUsers = sortedRanking.slice(0, 3);
  const getDisplayRanking = () =>
    showAllRanking
      ? sortedRanking
      : sortedRanking.slice(Math.max(0, myIndex - 2), Math.min(sortedRanking.length, myIndex + 3));

  // PR #2: ahora usa parseEvaluation() importada — lógica testeable
  const evaluateChallenge = async () => {
    if (!submissionText.trim()) return;
    setIsEvaluating(true);
    const res = await callGemini(
      `Evalúa: ${submissionText}`,
      `Juez Senior Randstad. JSON: {"score": number, "feedback": string}`
    );
    setEvaluation(parseEvaluation(res));
    setIsEvaluating(false);
  };

  const askMentor = async () => {
    setIsAiLoading(true);
    const res = await callGemini(
      `Mi puesto actual es #${sortedRanking[myIndex].position} con ${sortedRanking[myIndex].points} XP. Dame consejos para subir.`,
      "Mentor Randstad IA."
    );
    setMentorResponse(res);
    setIsAiLoading(false);
  };

  // PR #2: ahora usa likeThreadFn() importada — lógica testeable
  const likeThread = (id) => {
    setContent(prev => ({
      ...prev,
      forumThreads: likeThreadFn(prev.forumThreads, id, CURRENT_USER_ID),
    }));
  };

  const suggestDescription = async (title, setDesc) => {
    if (!title.trim()) return;
    setIsAiLoading(true);
    const res = await callGemini(
      `Genera una descripción profesional de 2 líneas para un curso corporativo llamado: "${title}"`,
      "Directo y profesional."
    );
    setDesc(res);
    setIsAiLoading(false);
  };

  const addItem = (category, newItem) => {
    if (!category) return;
    setContent(prev => ({
      ...prev,
      [category]: [
        ...prev[category],
        {
          ...newItem,
          id: Date.now(),
          instructor: CURRENT_USER_ID,
          points: DEFAULT_ITEM_POINTS,
          duration: 'NUEVO',
          views: '0',
          shortDesc: newItem.description
            ? newItem.description.substring(0, 50) + '...'
            : 'Nueva formación.',
        },
      ],
    }));
    setShowAddModal(false);
    setTargetCategory(null);
  };

  const NavItem = ({ id, icon: Icon, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex flex-col items-center p-3 transition-all ${
        activeTab === id
          ? 'text-[#3b82f6] border-b-2 border-[#3b82f6] font-black'
          : 'text-[#94a3b8] hover:text-[#3b82f6]'
      }`}
    >
      <Icon size={24} />
      <span className="text-[10px] font-bold mt-1 uppercase tracking-widest leading-none">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-900 overflow-x-hidden relative">
      {showAddModal && (
        <AddMaterialModal
          category={targetCategory}
          onClose={() => setShowAddModal(false)}
          onAdd={addItem}
          suggestDescription={suggestDescription}
          isAiLoading={isAiLoading}
        />
      )}

      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 px-6 h-20 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-black">R</div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">RANDSTAD DIGITAL</h1>
            <p className="text-[10px] text-[#3b82f6] font-black uppercase mt-1 tracking-widest leading-none">AI HUB ADOPCIÓN</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3b82f6] font-black shadow-xl ring-1 ring-slate-100 uppercase">
            {CURRENT_USER_ID}
          </div>
        </div>
      </header>

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
