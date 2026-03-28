import React from 'react';
import { Coffee, TrendingUp, Library, ShieldCheck, Plus, ChevronRight, PlayCircle } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

// Recibimos los datos y funciones desde el archivo principal (App.js) a través de "props"
const Academy = ({ content, setSelectedItem, setTargetCategory, setShowAddModal }) => {
  return (
    <div className="space-y-16 relative">
      {/* Patrón de malla técnica de fondo general para Academy */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0" style={{ backgroundImage: 'linear-gradient(#1e2b7a 1px, transparent 1px), linear-gradient(90deg, #1e2b7a 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Renderizado iterativo de las 4 categorías de formación */}
      {['cafeteria', 'pills', 'structural', 'externalCerts'].map((cat, sIdx) => (
        <ScrollReveal key={cat} delay={sIdx * 100}>
          {/* Contenedor Premium de "Cristal" con degradados de color según la categoría */}
          <div className={`p-1 w-full rounded-[4.5rem] bg-gradient-to-br shadow-xl relative z-10 ${cat === 'cafeteria' ? 'from-amber-200/50 to-transparent' : cat === 'pills' ? 'from-purple-200/50 to-transparent' : cat === 'structural' ? 'from-blue-200/50 to-transparent' : 'from-green-200/50 to-transparent'}`}>
            <div className={`p-10 rounded-[4.4rem] bg-white/70 backdrop-blur-3xl relative overflow-hidden`}>
              
              {/* Barra lateral indicadora de color */}
              <div className={`absolute top-0 right-0 w-2 h-full ${cat === 'cafeteria' ? 'bg-amber-400' : cat === 'pills' ? 'bg-purple-400' : cat === 'structural' ? 'bg-blue-400' : 'bg-green-400'}`} />

              {/* Cabecera de la Categoría */}
              <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 relative z-10 text-[#1e2b7a]">
                <div className="flex items-center gap-6">
                  <div className={`p-5 rounded-[2rem] shadow-xl ${cat === 'cafeteria' ? 'bg-amber-100 text-amber-600 shadow-amber-200/30' : cat === 'pills' ? 'bg-purple-100 text-purple-600 shadow-purple-200/30' : cat === 'structural' ? 'bg-blue-100 text-blue-600 shadow-blue-200/30' : 'bg-green-100 text-green-600 shadow-green-200/30'}`}>
                    {cat === 'cafeteria' ? <Coffee size={36}/> : cat === 'pills' ? <TrendingUp size={36}/> : cat === 'structural' ? <Library size={36}/> : <ShieldCheck size={36}/>}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">{cat === 'cafeteria' ? 'CafeterIA' : cat === 'pills' ? 'TikTok Learning' : cat === 'structural' ? 'Estructurales' : 'Certificaciones'}</h2>
                      <span className="px-3 py-1 bg-white shadow-inner text-slate-400 text-[9px] font-black rounded-full uppercase tracking-widest leading-none">{content[cat].length} Unidades</span>
                    </div>
                    <p className="text-xs font-black uppercase mt-2 tracking-[0.2em] opacity-40 italic text-pretty leading-none">
                      {cat === 'cafeteria' ? 'Inspiración de 30 min para expertos' : cat === 'pills' ? 'Vídeos rápidos con impacto real' : cat === 'structural' ? 'Conocimiento Core Randstad' : 'Formación recomendada de mercado'}
                    </p>
                  </div>
                </div>
                {/* Botón para abrir el formulario */}
                <button onClick={() => {setTargetCategory(cat); setShowAddModal(true);}} className={`px-6 py-4 text-white rounded-[2rem] shadow-2xl hover:scale-105 transition-all flex items-center gap-2 font-black uppercase text-[10px] italic tracking-widest leading-none group ${cat === 'cafeteria' ? 'bg-amber-600 shadow-amber-600/20' : cat === 'pills' ? 'bg-purple-600 shadow-purple-600/20' : cat === 'structural' ? 'bg-[#3b82f6] shadow-blue-600/20' : 'bg-green-600 shadow-green-600/20'}`}>
                  <Plus size={20} className="group-hover:rotate-90 transition-transform" /> Añadir Material
                </button>
              </div>

              {/* Listado de Cursos/Materiales */}
              <div className={cat === 'pills' ? "flex gap-8 overflow-x-auto pb-10 scrollbar-hide px-2" : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"}>
                {content[cat].map((item) => (
                  <div key={item.id} onClick={() => setSelectedItem({ data: item, cat })} className={cat === 'pills' ? "min-w-[280px] h-[440px] bg-slate-900 rounded-[4rem] relative overflow-hidden group shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] cursor-pointer hover:scale-[1.03] transition-all border-4 border-white/10" : `group bg-white border border-slate-100 rounded-[3.5rem] p-10 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 transition-all cursor-pointer relative h-full flex flex-col border-b-8 ${cat === 'cafeteria' ? 'hover:border-b-amber-500 border-b-transparent' : cat === 'structural' ? 'hover:border-b-blue-600 border-b-transparent' : 'hover:border-b-green-500 border-b-transparent'}`}>
                    
                    {cat === 'pills' ? (
                      <div className="absolute bottom-12 left-10 right-10 z-20 text-white">
                        <p className="text-2xl font-black uppercase italic leading-tight tracking-tighter mb-4">{item.title}</p>
                        <p className="text-white/40 text-xs font-medium leading-relaxed line-clamp-2 italic mb-8">"{item.shortDesc}"</p>
                        <div className="flex items-center justify-between border-t border-white/10 pt-6">
                          <span className="font-black text-white/40 uppercase tracking-widest text-[10px] leading-none">{item.duration}</span>
                          <div className="p-4 bg-purple-600 rounded-[1.8rem] text-white shadow-xl shadow-purple-600/30 group-hover:scale-110 transition-transform leading-none"><PlayCircle size={32} /></div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col text-[#1e2b7a]">
                        <div className="flex justify-between items-start mb-10">
                          <div className={`p-5 rounded-3xl ${cat === 'cafeteria' ? 'bg-amber-50 text-amber-600' : cat === 'structural' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'} shadow-sm group-hover:rotate-6 transition-transform duration-500`}>
                            {cat === 'cafeteria' ? <Coffee size={36}/> : cat === 'structural' ? <Library size={36}/> : <ShieldCheck size={36}/>}
                          </div>
                          <div className="p-3 bg-slate-50 rounded-2xl text-slate-200 group-hover:text-blue-600 transition-colors leading-none"><ChevronRight size={24}/></div>
                        </div>
                        <h4 className={`font-black text-2xl uppercase italic tracking-tighter leading-[1.1] mb-6 transition-colors ${cat === 'cafeteria' ? 'group-hover:text-amber-600' : cat === 'structural' ? 'group-hover:text-blue-600' : 'group-hover:text-green-600'}`}>{item.title}</h4>
                        <p className="text-slate-400 text-sm font-medium leading-relaxed mb-10 line-clamp-3 italic text-pretty">"{item.shortDesc}"</p>
                        <div className="mt-auto border-t border-slate-50 pt-8 flex justify-between items-center text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">
                          <span className="flex items-center gap-2">{item.provider || 'RANDSTAD'}</span>
                          <span className={`px-4 py-2 rounded-2xl font-black ${cat === 'cafeteria' ? 'text-amber-600 bg-amber-50' : cat === 'structural' ? 'text-blue-600 bg-blue-50' : 'text-green-600 bg-green-50'}`}>{item.duration || 'OFICIAL'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      ))}
    </div>
  );
};

export default Academy;
