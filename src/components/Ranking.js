// src/components/Ranking.js - PR #4: PropTypes
import React from "react";
import PropTypes from "prop-types";
import { Medal, Crown, Lightbulb, ArrowUp, ChevronRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const Ranking = ({
  sortedRanking, myIndex, podiumUsers, getDisplayRanking,
  showAllRanking, setShowAllRanking, askMentor,
  isAiLoading, mentorResponse, CURRENT_USER_ID
}) => {
  return (
    <div className="animate-in fade-in duration-500 space-y-16 text-[#1e2b7a]">

      <ScrollReveal direction="none">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-5xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">LIDERES DE ADOPCION IA</h2>
          <p className="text-[#94a3b8] font-bold text-xs uppercase tracking-[0.3em] leading-none">RECONOCIMIENTO AL TALENTO Y LA INNOVACION</p>
        </div>
      </ScrollReveal>

      <div className="flex flex-col md:flex-row items-end justify-center gap-4 md:gap-0 mb-20 px-4 text-[#1e2b7a]" role="list" aria-label="Podio top 3">

        {podiumUsers[1] && (
          <div className="order-2 md:order-1 flex-1 max-w-[280px] w-full" role="listitem">
            <ScrollReveal direction="up" delay={200}>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-slate-200 mb-4 relative uppercase leading-none" aria-hidden="true">
                  <span className="text-2xl font-black text-slate-300 italic">{podiumUsers[1].avatar}</span>
                  <div className="absolute -top-3 -right-3 bg-slate-300 text-white p-1.5 rounded-xl shadow-lg"><Medal size={20} aria-hidden="true"/></div>
                </div>
                <div className="bg-white w-full p-8 rounded-t-[3rem] shadow-sm border-x border-t border-slate-100 h-40 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 mb-1 leading-none" aria-label="Posicion 2">#2</p>
                  <p className="font-black uppercase italic text-sm leading-none">{podiumUsers[1].name}</p>
                  <p className="text-blue-500 font-black text-lg mt-2 leading-none">{podiumUsers[1].points} <span className="text-[10px] opacity-40 uppercase">XP</span></p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {podiumUsers[0] && (
          <div className="order-1 md:order-2 flex-1 max-w-[320px] w-full z-10" role="listitem">
            <ScrollReveal direction="up" delay={0}>
              <div className="flex flex-col items-center">
                <div className="w-28 h-28 rounded-[2.5rem] bg-white shadow-2xl flex items-center justify-center border-4 border-[#f59e0b] mb-4 relative scale-110 uppercase leading-none" aria-hidden="true">
                  <span className="text-4xl font-black text-[#f59e0b] italic">{podiumUsers[0].avatar}</span>
                  <div className="absolute -top-6 bg-[#f59e0b] text-white px-4 py-1.5 rounded-full shadow-xl flex items-center gap-2 font-black text-[10px] uppercase italic tracking-widest animate-bounce leading-none"><Crown size={14} aria-hidden="true"/> LIDER</div>
                </div>
                <div className="bg-white w-full p-10 rounded-t-[4rem] shadow-2xl border-x border-t border-[#f1f5f9] h-56 text-center flex flex-col justify-center ring-4 ring-[#3b82f6]/5">
                  <p className="text-[11px] font-black text-[#f59e0b] mb-1 leading-none" aria-label="Posicion 1">#1</p>
                  <p className="font-black uppercase italic text-lg leading-none">{podiumUsers[0].name}</p>
                  <p className="text-[#3b82f6] font-black text-2xl mt-3 leading-none uppercase">{podiumUsers[0].points} <span className="text-xs opacity-40 uppercase">XP</span></p>
                  <span className="text-[9px] font-black bg-blue-50 text-[#3b82f6] px-3 py-1 rounded-full w-fit mx-auto mt-4 tracking-widest leading-none">{podiumUsers[0].tier}</span>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}

        {podiumUsers[2] && (
          <div className="order-3 md:order-3 flex-1 max-w-[280px] w-full" role="listitem">
            <ScrollReveal direction="up" delay={400}>
              <div className="flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl bg-white shadow-xl flex items-center justify-center border-4 border-amber-600/30 mb-4 relative uppercase leading-none" aria-hidden="true">
                  <span className="text-2xl font-black text-amber-700/40 italic">{podiumUsers[2].avatar}</span>
                  <div className="absolute -top-3 -right-3 bg-amber-700 text-white p-1.5 rounded-xl shadow-lg"><Medal size={20} aria-hidden="true"/></div>
                </div>
                <div className="bg-white w-full p-8 rounded-t-[3rem] shadow-sm border-x border-t border-slate-100 h-32 text-center flex flex-col justify-center">
                  <p className="text-[10px] font-black text-slate-400 mb-1 leading-none" aria-label="Posicion 3">#3</p>
                  <p className="font-black uppercase italic text-sm leading-none">{podiumUsers[2].name}</p>
                  <p className="text-blue-500 font-black text-lg mt-2 leading-none">{podiumUsers[2].points} <span className="text-[10px] opacity-40 uppercase">XP</span></p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        )}
      </div>

      <ScrollReveal direction="none">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#1e2b7a] to-[#3b82f6] p-8 rounded-[3rem] shadow-2xl text-white flex flex-col gap-6 relative overflow-hidden group mb-12">
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center font-black text-2xl text-white shadow-inner uppercase leading-none" aria-hidden="true">
                {CURRENT_USER_ID}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-200 mb-1 leading-none">TU POSICION ACTUAL</p>
                <h4 className="text-2xl font-black uppercase italic tracking-tighter leading-none">
                  {sortedRanking[myIndex]?.name} <span className="text-blue-300 opacity-50 ml-2">#{sortedRanking[myIndex]?.position}</span>
                </h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-black italic leading-none">{sortedRanking[myIndex]?.points} <span className="text-sm opacity-50 uppercase">XP</span></p>
              <span className="text-[9px] font-black bg-white text-[#1e2b7a] px-3 py-1 rounded-lg uppercase tracking-widest mt-3 inline-block leading-none">{sortedRanking[myIndex]?.tier}</span>
            </div>
          </div>

          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-col md:flex-row gap-4">
            <button
              onClick={askMentor}
              disabled={isAiLoading}
              aria-busy={isAiLoading}
              className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 leading-none w-fit"
            >
              <Lightbulb size={14} aria-hidden="true" /> Mentor de IA
            </button>
            {mentorResponse && (
              <div className="flex-1 p-4 bg-white/10 rounded-2xl text-[11px] font-medium italic animate-in fade-in leading-relaxed" role="status" aria-live="polite">
                "{mentorResponse}"
              </div>
            )}
          </div>
          <Sparkles className="absolute -right-10 top-0 text-white/5 w-64 h-64 -rotate-12 pointer-events-none" aria-hidden="true" />
        </div>
      </ScrollReveal>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between px-10 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6 leading-none">
          <span>Rango / Profesional</span>
          <span>Tier / Total XP</span>
        </div>

        <div className={`transition-all duration-500 overflow-hidden ${showAllRanking ? "max-h-[700px] overflow-y-auto pr-2" : "max-h-[500px]"}`}>
          <ol className="space-y-4">
            {getDisplayRanking().map((user) => (
              <li key={user.id} className={`p-6 px-10 bg-white border border-[#f1f5f9] rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all ${user.id === CURRENT_USER_ID ? "ring-2 ring-[#3b82f6] shadow-md bg-blue-50/10" : "shadow-sm"}`}>
                <div className="flex items-center gap-6">
                  <span className={`text-sm font-black italic w-6 leading-none ${user.id === CURRENT_USER_ID ? "text-[#3b82f6]" : "text-slate-300"}`} aria-label={`Posicion ${user.position}`}>{user.position}</span>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs uppercase ${user.id === CURRENT_USER_ID ? "bg-[#3b82f6] text-white shadow-lg" : "bg-slate-50 text-slate-400 shadow-inner"}`} aria-hidden="true">{user.avatar}</div>
                  <div>
                    <p className={`font-black text-sm uppercase italic leading-none ${user.id === CURRENT_USER_ID ? "text-[#3b82f6]" : "text-[#1e2b7a]"}`}>{user.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1 leading-none">{user.tier}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase leading-none ${user.tier === "AI Visionary" ? "bg-amber-50 text-amber-600" : "bg-slate-50 text-slate-500"}`}>{user.tier}</span>
                  <p className="text-lg font-black italic w-20 text-right leading-none uppercase">{user.points} <span className="text-[9px] opacity-20 uppercase">XP</span></p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="pt-8 text-center">
          <button
            onClick={() => setShowAllRanking(!showAllRanking)}
            aria-expanded={showAllRanking}
            aria-controls="ranking-list"
            className="px-10 py-4 bg-white text-[#1e2b7a] border-2 border-[#f1f5f9] rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-[#1e2b7a] hover:text-white transition-all shadow-sm mx-auto flex items-center gap-2 italic leading-none"
          >
            {showAllRanking ? <><ArrowUp size={14} aria-hidden="true"/> MOSTRAR MENOS</> : <><ChevronRight className="rotate-90" size={14} aria-hidden="true"/> VER RANKING COMPLETO</>}
          </button>
        </div>
      </div>
    </div>
  );
};

Ranking.propTypes = {
  sortedRanking: PropTypes.arrayOf(
    PropTypes.shape({
      id:       PropTypes.string.isRequired,
      name:     PropTypes.string.isRequired,
      points:   PropTypes.number.isRequired,
      tier:     PropTypes.string.isRequired,
      avatar:   PropTypes.string.isRequired,
      position: PropTypes.number.isRequired,
    })
  ).isRequired,
  myIndex:          PropTypes.number.isRequired,
  podiumUsers:      PropTypes.array.isRequired,
  getDisplayRanking: PropTypes.func.isRequired,
  showAllRanking:   PropTypes.bool.isRequired,
  setShowAllRanking: PropTypes.func.isRequired,
  askMentor:        PropTypes.func.isRequired,
  isAiLoading:      PropTypes.bool.isRequired,
  mentorResponse:   PropTypes.string.isRequired,
  CURRENT_USER_ID:  PropTypes.string.isRequired,
};

export default Ranking;
