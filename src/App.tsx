// src/App.tsx - VERSION PR #4
// Integra ErrorBoundary en cada seccion de la app.
// Si una seccion falla, las demas siguen funcionando.

import React, { useState } from "react";
import { BookOpen, MessageCircle, Trophy, BarChart3 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { callGemini } from "./api/gemini";
import Academy from "./components/Academy";
import Forum from "./components/Forum";
import Challenges from "./components/Challenges";
import Ranking from "./components/Ranking";
import AddMaterialModal from "./components/AddMaterialModal";
import ErrorBoundary from "./components/ErrorBoundary";

import { CURRENT_USER_ID, DEFAULT_ITEM_POINTS } from "./constants";
import { initialContent } from "./data/mockData";
import type { InitialContent, ContentItem } from "./data/mockData";

import { useChallenge } from "./hooks/useChallenge";
import { useRanking } from "./hooks/useRanking";
import { useForum } from "./hooks/useForum";

interface NavItemProps {
  id: string;
  icon: LucideIcon;
  label: string;
}

const App = () => {
  const [activeTab, setActiveTab] = useState("courses");
  const [selectedItem, setSelectedItem] = useState<{ data: ContentItem; cat: string } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [targetCategory, setTargetCategory] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [content, setContent] = useState<InitialContent>(initialContent);

  const challenge = useChallenge();
  const ranking   = useRanking(content.ranking);
  const forum     = useForum(content.forumThreads);

  const suggestDescription = async (title: string, setDesc: (desc: string) => void) => {
    if (!title.trim()) return;
    setIsAiLoading(true);
    const res = await callGemini(
      `Genera una descripcion profesional de 2 lineas para un curso corporativo llamado: "${title}"`,
      "Directo y profesional."
    );
    setDesc(res);
    setIsAiLoading(false);
  };

  const addItem = (category: string | null, newItem: { title: string; description: string; mediaUrl: string; mediaType: string }) => {
    if (!category) return;
    setContent(prev => ({
      ...prev,
      [category]: [
        ...(prev[category as keyof typeof prev] as ContentItem[]),
        {
          ...newItem,
          id: Date.now(),
          instructor: CURRENT_USER_ID,
          points: DEFAULT_ITEM_POINTS,
          duration: "NUEVO",
          views: "0",
          shortDesc: newItem.description
            ? newItem.description.substring(0, 50) + "..."
            : "Nueva formacion.",
        },
      ],
    }));
    setShowAddModal(false);
    setTargetCategory(null);
  };

  const NavItem = ({ id, icon: Icon, label }: NavItemProps) => (
    <button
      onClick={() => setActiveTab(id)}
      aria-current={activeTab === id ? "page" : undefined}
      className={`flex flex-col items-center p-3 transition-all ${
        activeTab === id
          ? "text-[#3b82f6] border-b-2 border-[#3b82f6] font-black"
          : "text-[#94a3b8] hover:text-[#3b82f6]"
      }`}
    >
      <Icon size={24} aria-hidden="true" />
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
          <div className="w-10 h-10 bg-blue-600 rounded-xl text-white flex items-center justify-center font-black" aria-hidden="true">R</div>
          <div>
            <h1 className="text-xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">RANDSTAD DIGITAL</h1>
            <p className="text-[10px] text-[#3b82f6] font-black uppercase mt-1 tracking-widest leading-none">AI HUB ADOPCION</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-[#3b82f6] font-black shadow-xl ring-1 ring-slate-100 uppercase" aria-label={`Usuario: ${CURRENT_USER_ID}`}>
            {CURRENT_USER_ID}
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-6xl mx-auto w-full px-6 pt-4 pb-40 text-[#1e2b7a]">

        {/* ErrorBoundary por seccion: si una falla, las demas siguen */}

        {activeTab === "courses" && (
          <ErrorBoundary sectionName="Academy">
            <Academy
              content={content}
              setSelectedItem={setSelectedItem}
              setTargetCategory={setTargetCategory}
              setShowAddModal={setShowAddModal}
            />
          </ErrorBoundary>
        )}

        {activeTab === "forum" && (
          <ErrorBoundary sectionName="Comunidad">
            <Forum
              forumThreads={forum.threads}
              forumCategory={forum.forumCategory}
              setForumCategory={forum.setForumCategory}
              setSelectedThreadId={forum.setSelectedThreadId}
              likeThread={forum.handleLike}
              CURRENT_USER_ID={CURRENT_USER_ID}
              setShowAddThreadModal={forum.setShowAddThreadModal}
            />
          </ErrorBoundary>
        )}

        {activeTab === "challenges" && (
          <ErrorBoundary sectionName="Retos">
            <Challenges
              activeChallenge={content.activeChallenge}
              pastChallenges={content.pastChallenges}
              submissionText={challenge.submissionText}
              setSubmissionText={challenge.setSubmissionText}
              evaluateChallenge={challenge.evaluateChallenge}
              isEvaluating={challenge.isEvaluating}
              evaluation={challenge.evaluation}
              setEvaluation={challenge.setEvaluation}
              setSelectedPastChallenge={() => {}}
            />
          </ErrorBoundary>
        )}

        {activeTab === "ranking" && (
          <ErrorBoundary sectionName="Ranking">
            <Ranking
              sortedRanking={ranking.sortedRanking}
              myIndex={ranking.myIndex}
              podiumUsers={ranking.podiumUsers}
              getDisplayRanking={ranking.getDisplayRanking}
              showAllRanking={ranking.showAllRanking}
              setShowAllRanking={ranking.setShowAllRanking}
              askMentor={ranking.askMentor}
              isAiLoading={ranking.isAiLoading}
              mentorResponse={ranking.mentorResponse}
              CURRENT_USER_ID={CURRENT_USER_ID}
            />
          </ErrorBoundary>
        )}

      </main>

      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-xl px-6 z-40" aria-label="Navegacion principal">
        <div className="bg-white/90 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.2)] p-2.5 flex justify-around items-center">
          <NavItem id="courses"    icon={BookOpen}      label="Academy"   />
          <NavItem id="forum"      icon={MessageCircle} label="Comunidad" />
          <NavItem id="challenges" icon={Trophy}        label="Retos"     />
          <NavItem id="ranking"    icon={BarChart3}     label="Ranking"   />
        </div>
      </nav>

    </div>
  );
};

export default App;
