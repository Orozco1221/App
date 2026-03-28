import React from 'react';
import { Plus, ThumbsUp, MessageCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

// Recibimos los datos de los hilos del foro y las funciones para interactuar
const Forum = ({
  forumThreads,
  forumCategory,
  setForumCategory,
  setSelectedThreadId,
  likeThread,
  CURRENT_USER_ID,
  setShowAddThreadModal
}) => {
  return (
    <div className="animate-in fade-in duration-300 text-[#1e2b7a]">
      {/* Cabecera del Foro */}
      <div className="flex justify-between items-start mb-10 text-[#1e2b7a]">
        <div>
          <h2 className="text-4xl font-black uppercase italic tracking-tighter text-[#1e2b7a] leading-none">COMUNIDAD IA</h2>
          <p className="text-[#94a3b8] font-bold text-[12px] mt-2 tracking-widest uppercase italic leading-none">Debate con expertos de Randstad Digital.</p>
        </div>
        <button onClick={() => setShowAddThreadModal(true)} className="bg-[#3b82f6] text-white px-8 py-4 rounded-[1.2rem] font-black uppercase shadow-lg hover:scale-105 transition-all flex items-center gap-2 italic tracking-widest leading-none">
          <Plus size={24}/> NUEVO TEMA
        </button>
      </div>

      <div className="grid grid-cols-12 gap-8 text-[#1e2b7a]">
        {/* Barra lateral de Categorías */}
        <aside className="col-span-3 text-[#1e2b7a]">
          <ScrollReveal direction="left">
            <div className="bg-white p-8 rounded-[1.5rem] shadow-sm h-fit">
              <h3 className="text-[10px] font-black uppercase text-[#94a3b8] tracking-[0.2em] mb-6 leading-none">Categorías</h3>
              {['PRODUCTIVIDAD', 'CONSULTORÍA', 'LEGAL', 'HERRAMIENTAS'].map(cat => (
                <div key={cat} className="flex justify-between items-center mb-4 text-[10px] font-black text-[#64748b] hover:text-[#3b82f6] cursor-pointer group uppercase leading-none">
                  <span className="group-hover:translate-x-1 transition-transform">{cat}</span>
                  <span className="text-[#cbd5e1]">12</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </aside>

        {/* Lista Central de Hilos de Debate */}
        <div className="col-span-9">
          <div className="flex gap-10 border-b border-slate-100 mb-8 px-2 font-black text-[10px] tracking-widest text-[#94a3b8] leading-none">
            {['TRENDING', 'NEW', 'VISTOS'].map(fCat => (
              <button key={fCat} onClick={() => setForumCategory(fCat.toLowerCase())} className={`pb-4 transition-all ${forumCategory === fCat.toLowerCase() ? 'text-[#3b82f6] border-b-2 border-[#3b82f6]' : ''}`}>
                {fCat}
              </button>
            ))}
          </div>
          
          <div className="space-y-6">
            {forumThreads.map((thread, idx) => (
              <ScrollReveal key={thread.id} direction="up" delay={idx * 100}>
                <div onClick={() => setSelectedThreadId(thread.id)} className="bg-white p-8 rounded-[1.8rem] shadow-sm border border-[#f1f5f9] flex items-center justify-between group hover:shadow-md transition-all cursor-pointer text-[#1e2b7a]">
                  
                  {/* Info del Autor y Título */}
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-[1.2rem] ${thread.avatar === 'AM' ? 'bg-[#ff7e3b]' : 'bg-[#3b82f6]'} text-white flex items-center justify-center font-black text-md shadow-md uppercase leading-none`}>
                      {thread.avatar}
                    </div>
                    <div>
                      <h4 className="font-black text-md text-[#1e2b7a] uppercase italic group-hover:text-[#3b82f6] transition-colors leading-tight leading-none">{thread.title}</h4>
                      <p className="text-[10px] font-bold text-[#94a3b8] uppercase mt-1 leading-none">POR {thread.user}</p>
                    </div>
                  </div>
                  
                  {/* Estadísticas (Likes, Comentarios, Fecha) */}
                  <div className="flex items-center gap-10">
                    <span className="bg-[#f1f5f9] px-4 py-1.5 rounded-full text-[9px] font-black text-[#64748b] tracking-widest uppercase leading-none">{thread.category}</span>
                    <div className="flex items-center gap-1 text-[#64748b] font-black text-sm w-8 leading-none">
                      <MessageCircle size={16} /> <span>{thread.comments}</span>
                    </div>
                    {/* Botón de Like con propagación detenida para no abrir el hilo al hacer click */}
                    <button onClick={(e) => { e.stopPropagation(); likeThread(thread.id); }} className={`flex items-center gap-1 font-black text-sm w-10 transition-all ${thread.likedBy.includes(CURRENT_USER_ID) ? 'text-[#3b82f6] scale-110' : 'text-slate-300 hover:text-[#3b82f6]'}`}>
                      <ThumbsUp size={16} fill={thread.likedBy.includes(CURRENT_USER_ID) ? "currentColor" : "none"} /> <span>{thread.likes}</span>
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

export default Forum;
