// src/components/Challenges.tsx
import React from "react";
import { Clock, Trophy, UploadCloud, Sparkles, Loader2, Star, History, ChevronRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import type { ActiveChallenge, Challenge } from "../data/mockData";
import type { Evaluation } from "../utils/parseEvaluation";

interface Props {
  activeChallenge: ActiveChallenge;
  pastChallenges: Challenge[];
  submissionText: string;
  setSubmissionText: (text: string) => void;
  evaluateChallenge: () => Promise<void>;
  isEvaluating: boolean;
  evaluation: Evaluation | null;
  setEvaluation: (e: Evaluation | null) => void;
  setSelectedPastChallenge: (challenge: Challenge) => void;
}

const Challenges: React.FC<Props> = ({
  activeChallenge, pastChallenges, submissionText, setSubmissionText,
  evaluateChallenge, isEvaluating, evaluation, setEvaluation, setSelectedPastChallenge
}) => {
  return (
    <div className="animate-in slide-in-from-bottom-6 duration-500 space-y-16 text-[#1e2b7a]">

      <ScrollReveal direction="up" delay={100}>
        <div className="bg-[#243782] p-16 rounded-[4rem] text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-16 items-center">
          <div className="flex-1 space-y-10">
            <div className="flex items-center gap-2 bg-[#1a2b7a] w-fit px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 italic leading-none">
              <Clock size={14} className="text-[#3b82f6]" aria-hidden="true" /> {activeChallenge.deadline}
            </div>
            <h3 className="text-5xl font-black uppercase italic tracking-tighter leading-[0.95]">{activeChallenge.title}</h3>
            <div className="bg-[#1a2b7a]/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm space-y-4">
              <div className="flex items-center gap-2 text-[#3b82f6] font-black text-[10px] uppercase tracking-widest leading-none">
                <Trophy size={16} aria-hidden="true"/> OBJETIVO DEL RETO
              </div>
              <p className="text-md font-medium leading-relaxed">{activeChallenge.objective}</p>
            </div>
            <p className="text-white/40 text-[13px] italic leading-relaxed pl-4 border-l-2 border-[#3b82f6]/40">
              "{activeChallenge.description}"
            </p>
          </div>

          <div className="w-full md:w-[450px] bg-white rounded-[3rem] p-10 shadow-2xl self-stretch flex flex-col justify-center text-[#1e2b7a]">
            {!evaluation ? (
              <div className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">TU PROPUESTA</h3>
                  <span className="text-[11px] font-black text-[#f59e0b] uppercase leading-none">+ {activeChallenge.rewardPoints} XP</span>
                </div>
                <div className="relative group">
                  <label htmlFor="challenge-textarea" className="sr-only">Escribe tu prompt aqui</label>
                  <textarea
                    id="challenge-textarea"
                    value={submissionText}
                    onChange={e => setSubmissionText(e.target.value)}
                    className="w-full p-6 bg-[#f8fafc] border-2 border-slate-100 rounded-[2rem] h-48 text-sm outline-none focus:ring-4 focus:ring-blue-500/10 text-slate-800 leading-relaxed"
                    placeholder="Escribe tu prompt aqui..."
                    aria-describedby="challenge-hint"
                  />
                  <div className="absolute bottom-6 right-6 text-slate-200" aria-hidden="true"><UploadCloud size={28} /></div>
                </div>
                <p id="challenge-hint" className="sr-only">Escribe un prompt que resuelva el reto y haz click en Entregar para evaluarlo con IA</p>
                <button
                  onClick={evaluateChallenge}
                  disabled={isEvaluating || !submissionText.trim()}
                  aria-busy={isEvaluating}
                  className="w-full py-6 bg-[#96b5f6] text-white rounded-[2rem] font-black uppercase italic shadow-xl hover:bg-[#3b82f6] transition-all flex items-center justify-center gap-4 disabled:opacity-50 leading-none"
                >
                  {isEvaluating ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Sparkles size={24} aria-hidden="true" />}
                  {isEvaluating ? "EVALUANDO..." : "ENTREGAR"}
                </button>
              </div>
            ) : (
              <div className="animate-in zoom-in text-center space-y-6 text-[#1e2b7a]" role="status" aria-live="polite">
                <p className="text-[10px] font-black text-[#94a3b8] uppercase tracking-widest leading-none">RESULTADO FINAL</p>
                <div className="flex justify-center gap-2" aria-label={`Puntuacion: ${evaluation.score} de 5`}>
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={40} className={i <= evaluation.score ? "text-[#f59e0b] fill-[#f59e0b] drop-shadow-md" : "text-slate-100"} aria-hidden="true" />
                  ))}
                </div>
                <p className="text-6xl font-black text-[#1e2b7a] italic leading-none" aria-hidden="true">{evaluation.score}<span className="text-2xl opacity-20">/5</span></p>
                <p className="bg-slate-50 p-6 rounded-2xl text-[12px] italic text-[#64748b] leading-relaxed">"{evaluation.feedback}"</p>
                <button onClick={() => setEvaluation(null)} className="text-[10px] font-black uppercase text-[#3b82f6] underline tracking-widest leading-none">
                  REINTENTAR
                </button>
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>

      <section className="space-y-10 text-[#1e2b7a]" aria-label="Retos historicos">
        <ScrollReveal direction="up">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white rounded-3xl shadow-sm"><History size={28} className="text-[#1e2b7a]" aria-hidden="true"/></div>
            <div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">Repositorio Historico</h3>
              <p className="text-[10px] text-[#94a3b8] font-black uppercase tracking-widest mt-1">Aprende de los mejores retos finalizados</p>
            </div>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {pastChallenges.map((past, idx) => (
            <ScrollReveal key={past.id} direction="up" delay={idx * 100}>
              <div
                onClick={() => setSelectedPastChallenge(past)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedPastChallenge(past)}
                role="button"
                tabIndex={0}
                aria-label={`Ver reto cerrado: ${past.title}, ganador ${past.winner}`}
                className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-xl transition-all cursor-pointer"
              >
                <div>
                  <div className="flex gap-4 mb-3 text-[9px] font-black uppercase tracking-widest leading-none">
                    <span className="bg-[#1e2b7a] text-white px-3 py-1 rounded-full italic">CERRADO</span>
                    <span className="text-[#94a3b8] py-1">{past.date}</span>
                  </div>
                  <h4 className="font-black text-xl text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-tight">{past.title}</h4>
                  <p className="text-[9px] font-bold text-[#94a3b8] uppercase mt-2 italic flex items-center gap-2 tracking-widest leading-none">
                    Destacado: <span className="text-[#3b82f6] font-black">{past.winner}</span>
                  </p>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <div className="flex gap-1" aria-label={`Puntuacion ${past.score} de 5`}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} className={past.score !== undefined && i <= past.score ? "text-[#f59e0b] fill-[#f59e0b]" : "text-slate-100"} aria-hidden="true" />)}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-[#f8fafc] flex items-center justify-center text-slate-300 group-hover:bg-[#3b82f6] group-hover:text-white transition-all shadow-inner leading-none" aria-hidden="true">
                    <ChevronRight size={24}/>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Challenges;
