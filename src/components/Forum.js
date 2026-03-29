// src/components/Forum.js - PR #4: PropTypes + accesibilidad
import React from "react";
import PropTypes from "prop-types";
import { Plus, ThumbsUp, MessageCircle } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const Forum = ({
  forumThreads, forumCategory, setForumCategory,
  setSelectedThreadId, likeThread, CURRENT_USER_ID, setShowAddThreadModal
}) => {
  return (
    <div className="animate-in fade-in duration-300 text-[#1e2b7a]">
      <div className="flex justify-between items-start mb-10 text-[#1e2b7a]">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">COMUNIDAD IA</h2>
          <p className="text-[#94a3b8] font-bold text-[12px] mt-2 tracking-widest uppercase italic leading-none">Debate con expertos de Randstad Digital.</p>
        </div>
        <button
          onClick={() => setShowAddThreadModal(true)}
          aria-label="Crear nuevo tema en el foro"
          className="bg-[#3b82f6] text-white px-8 py-4 rounded-[1.2rem] font-black uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 italic tracking-widest leading-none"
        >
          <Plus size={24}/> NUEVO TEMA
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 text-[#1e2b7a]">
        <aside className="col-span-3 text-[#1e2b7a]">
          <ScrollReveal direction="left">
            <div className="bg-white p-8 rounded-[1.5rem] shadow-sm h-fit">
              <h3 className="text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em] mb-6 leading-none">Categorias</h3>
              {["PRODUCTIVIDAD", "CONSULTORIA", "LEGAL", "HERRAMIENTAS"].map(cat => (
                // a11y: div clicable -> role=button + tabIndex + onKeyDown
                <div
                  key={cat}
                  onClick={() => setForumCategory(cat.toLowerCase())}
                  onKeyDown={(e) => e.key === "Enter" && setForumCategory(cat.toLowerCase())}
                  role="button"
                  tabIndex={0}
                  aria-pressed={forumCategory === cat.toLowerCase()}
                  className="flex justify-between items-center mb-4 text-[10px] font-black text-[#64748b] hover:text-[#3b82f6] cursor-pointer group uppercase leading-none"
                >
                  <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                  <span className="text-[#cbd5e1]">12</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </aside>

        <div className="col-span-9">
          <div className="flex gap-10 border-b border-slate-100 mb-8 px-2 font-black text-[10px] tracking-widest text-[#94a3b8] leading-none">
            {["TRENDING", "NEW", "VISTOS"].map(fCat => (
              <button
                key={fCat}
                onClick={() => setForumCategory(fCat.toLowerCase())}
                aria-pressed={forumCategory === fCat.toLowerCase()}
                className={`pb-4 transition-all ${forumCategory === fCat.toLowerCase() ? "text-[#3b82f6] border-b-2 border-[#3b82f6]" : ""}`}
              >
                {fCat}
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {forumThreads.map((thread, idx) => (
              <ScrollReveal key={thread.id} direction="up" delay={idx * 100}>
                <div
                  onClick={() => setSelectedThreadId(thread.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedThreadId(thread.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ver hilo: ${thread.title}`}
                  className="bg-white p-8 rounded-[1.8rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-md transition-all cursor-pointer text-[#1e2b7a]"
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-[1.2rem] ${thread.avatar === "AM" ? "bg-[#ff7e3b]" : "bg-[#3b82f6]"} text-white flex items-center justify-center font-black text-md shadow-md uppercase leading-none`}>
                      {thread.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-md text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-none">{thread.title}</h4>
                      <p className="text-[10px] font-bold text-[#94a3b8] uppercase mt-1 leading-none">POR {thread.user}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-10">
                    <span className="bg-[#f1f5f9] px-4 py-1.5 rounded-full text-[9px] font-black text-[#64748b] tracking-widest uppercase leading-none">{thread.category}</span>
                    <div className="flex items-center gap-1 text-[#64748b] font-black text-sm w-8 leading-none">
                      <MessageCircle size={16} aria-hidden="true" /> <span>{thread.comments}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); likeThread(thread.id); }}
                      aria-label={thread.likedBy.includes(CURRENT_USER_ID) ? `Quitar like a ${thread.title}` : `Dar like a ${thread.title}`}
                      aria-pressed={thread.likedBy.includes(CURRENT_USER_ID)}
                      className={`flex items-center gap-1 font-black text-sm w-10 transition-all ${thread.likedBy.includes(CURRENT_USER_ID) ? "text-[#3b82f6] scale-110" : "text-slate-300 hover:text-[#3b82f6]"}`}
                    >
                      <ThumbsUp size={16} fill={thread.likedBy.includes(CURRENT_USER_ID) ? "currentColor" : "none"} aria-hidden="true" />
                      <span>{thread.likes}</span>
                    </button>
                    <span className="text-[9px] font-black text-[#cbd5e1] uppercase tracking-tighter leading-none">{thread.date}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

Forum.propTypes = {
  forumThreads: PropTypes.arrayOf(
    PropTypes.shape({
      id:       PropTypes.number.isRequired,
      title:    PropTypes.string.isRequired,
      user:     PropTypes.string.isRequired,
      avatar:   PropTypes.string.isRequired,
      category: PropTypes.string.isRequired,
      likes:    PropTypes.number.isRequired,
      comments: PropTypes.number.isRequired,
      date:     PropTypes.string.isRequired,
      likedBy:  PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ).isRequired,
  forumCategory:         PropTypes.string.isRequired,
  setForumCategory:      PropTypes.func.isRequired,
  setSelectedThreadId:   PropTypes.func.isRequired,
  likeThread:            PropTypes.func.isRequired,
  CURRENT_USER_ID:       PropTypes.string.isRequired,
  setShowAddThreadModal:  PropTypes.func.isRequired,
};

export default Forum;
