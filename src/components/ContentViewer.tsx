// src/components/ContentViewer.tsx
// Modal visor de contenido: reproductor a la izquierda + panel IA a la derecha.
import React, { useState, useRef, useEffect } from 'react';
import {
  X, Sparkles, Bot, Brain, Eye, Share2,
  ChevronRight, Loader2, CheckCircle, XCircle,
} from 'lucide-react';
import { callGemini } from '../api/gemini';
import type { ContentItem } from '../data/mockData';

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Props {
  item:     ContentItem;
  category: string;
  onClose:  () => void;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
}

interface QuizQuestion {
  question: string;
  options:  string[];
  answer:   number; // índice correcto
}

// ─── Colores por categoría ────────────────────────────────────────────────────

const CAT_COLORS: Record<string, { chip: string; border: string; label: string }> = {
  cafeteria:     { chip: 'bg-amber-100 text-amber-700',  border: 'border-amber-400', label: 'CAFETERÍA'     },
  pills:         { chip: 'bg-purple-100 text-purple-700',border: 'border-purple-400',label: 'TIKTOK LEARNING'},
  structural:    { chip: 'bg-blue-100 text-blue-700',    border: 'border-blue-400',  label: 'ESTRUCTURALES' },
  externalCerts: { chip: 'bg-green-100 text-green-700',  border: 'border-green-400', label: 'CERTIFICACIONES'},
};

// ─── Detección del tipo de media ──────────────────────────────────────────────

function detectMediaType(item: ContentItem): 'youtube' | 'pdf' | 'ppt' | 'mp4' | 'placeholder' {
  const url  = (item.mediaUrl  ?? '').toLowerCase();
  const path = (item.storagePath as string | undefined ?? '').toLowerCase();
  const type = (item.mediaType ?? '').toLowerCase();

  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (type === 'pdf'  || url.endsWith('.pdf')  || path.endsWith('.pdf'))  return 'pdf';
  if (type === 'ppt'  || url.endsWith('.ppt')  || url.endsWith('.pptx') ||
      path.endsWith('.ppt') || path.endsWith('.pptx'))                    return 'ppt';
  if (type === 'mp4'  || url.endsWith('.mp4')  || path.endsWith('.mp4')) return 'mp4';
  return 'placeholder';
}

// ─── Componente principal ─────────────────────────────────────────────────────

const ContentViewer: React.FC<Props> = ({ item, category, onClose }) => {
  const colors  = CAT_COLORS[category] ?? CAT_COLORS['cafeteria'];
  const mType   = detectMediaType(item);
  const mediaUrl = item.mediaUrl ?? '#';

  // — Estado IA ————————————————————————————————————————————————————————————
  const [aiSummary,      setAiSummary]      = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput,    setChatInput]    = useState('');
  const [chatLoading,  setChatLoading]  = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [quiz,           setQuiz]           = useState<QuizQuestion[]>([]);
  const [activeQuizIdx,  setActiveQuizIdx]  = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizLoading,    setQuizLoading]    = useState(false);

  // Scroll al último mensaje del chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // — Handlers IA ——————————————————————————————————————————————————————————

  const handleGenerateSummary = async () => {
    setSummaryLoading(true);
    const prompt =
      `Analiza este bloque formativo y dame exactamente 3 puntos clave de aprendizaje, ` +
      `en formato de lista con "•" al inicio de cada punto. ` +
      `Título: "${item.title}". Descripción: "${item.description}".`;
    const res = await callGemini(prompt, 'Eres un experto en formación corporativa. Sé conciso.');
    setAiSummary(res);
    setSummaryLoading(false);
  };

  const handleSendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatLoading(true);

    const context =
      `Eres el Tutor IA de Randstad Digital para el curso "${item.title}". ` +
      `Descripción del curso: "${item.description}". ` +
      `Responde de forma clara y práctica en español.`;
    const res = await callGemini(userMsg, context);
    setChatMessages(prev => [...prev, { role: 'ai', text: res }]);
    setChatLoading(false);
  };

  const handleGenerateQuiz = async () => {
    setQuizLoading(true);
    setQuiz([]);
    setActiveQuizIdx(0);
    setSelectedAnswer(null);

    const prompt =
      `Crea un quiz de 3 preguntas sobre el curso "${item.title}" (${item.description}). ` +
      `Devuelve SOLO un array JSON con este formato exacto, sin texto adicional:\n` +
      `[{"question":"...","options":["A","B","C","D"],"answer":0}]`;

    const raw = await callGemini(prompt, 'Devuelve SOLO JSON válido, sin markdown ni explicaciones.');
    try {
      const parsed: QuizQuestion[] = JSON.parse(
        raw.replace(/```json|```/g, '').trim()
      );
      setQuiz(parsed);
    } catch {
      setQuiz([{ question: 'Error al generar el quiz. Inténtalo de nuevo.', options: [], answer: 0 }]);
    }
    setQuizLoading(false);
  };

  const handleSelectAnswer = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setActiveQuizIdx(prev => prev + 1);
  };

  // ─── Renderer de media ─────────────────────────────────────────────────────

  const renderMedia = () => {
    switch (mType) {
      case 'youtube':
        return (
          <iframe
            src={mediaUrl}
            title={item.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      case 'pdf':
        return (
          <iframe
            src={mediaUrl}
            title={item.title}
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        );
      case 'ppt':
        return (
          <iframe
            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(mediaUrl)}`}
            title={item.title}
            className="w-full h-full"
            style={{ border: 'none' }}
          />
        );
      case 'mp4':
        return (
          <video
            src={mediaUrl}
            controls
            className="w-full h-full object-contain"
          />
        );
      default:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-slate-400">
            <Eye size={48} className="opacity-30" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-50">
              Vista previa no disponible
            </p>
            {item.link && (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-blue-600 text-white rounded-xl font-black text-xs uppercase hover:bg-blue-700 transition-colors"
              >
                Abrir enlace externo
              </a>
            )}
          </div>
        );
    }
  };

  // ─── Render principal ──────────────────────────────────────────────────────

  return (
    <div
      className="fixed inset-0 z-[200] bg-slate-900/90 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Visor: ${item.title}`}
    >
      {/* Contenedor principal — no propaga el click */}
      <div
        className="bg-[#0f172a] rounded-[2rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex w-full max-w-6xl"
        style={{ height: 'min(85vh, 700px)' }}
        onClick={e => e.stopPropagation()}
      >

        {/* ── IZQUIERDA: Reproductor ── */}
        <div className="flex-1 bg-black flex items-center justify-center relative min-w-0">
          {renderMedia()}
        </div>

        {/* ── DERECHA: Panel IA ── */}
        <div
          className="w-[420px] shrink-0 bg-white overflow-y-auto flex flex-col"
          style={{ maxHeight: 'min(85vh, 700px)' }}
        >
          {/* Cabecera */}
          <div className="p-6 pb-4 border-b border-slate-100 flex items-start justify-between gap-3">
            <div className="flex flex-col gap-2">
              <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-fit ${colors.chip}`}>
                {colors.label}
              </span>
              <h2 className="text-lg font-black uppercase italic text-[#1e2b7a] leading-tight">
                {item.title}
              </h2>
              <p className="text-xs text-slate-500 italic leading-relaxed">
                "{item.description}"
              </p>
              <div className="flex gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {item.duration  && <span>⏱ {item.duration}</span>}
                {item.instructor&& <span>👤 {item.instructor}</span>}
                {item.views     && <span>👁 {item.views}</span>}
                {item.level     && <span>📊 {item.level}</span>}
                {item.provider  && <span>🏢 {item.provider}</span>}
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label="Cerrar visor"
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-6 space-y-5">

            {/* ── RESUMEN IA ── */}
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-blue-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-700">
                    Resumen IA
                  </span>
                </div>
                <button
                  onClick={handleGenerateSummary}
                  disabled={summaryLoading}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center gap-1"
                >
                  {summaryLoading
                    ? <><Loader2 size={10} className="animate-spin" /> Generando…</>
                    : <><Sparkles size={10} /> GENERAR +</>
                  }
                </button>
              </div>
              {aiSummary ? (
                <div className="text-xs text-blue-800 leading-relaxed whitespace-pre-line">
                  {aiSummary}
                </div>
              ) : (
                <p className="text-xs text-blue-400 italic">
                  Analiza los puntos fundamentales del bloque formativo.
                </p>
              )}
            </div>

            {/* ── TUTOR IA ── */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={14} className="text-[#1e2b7a]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1e2b7a]">
                  Tutor Randstad IA ✨
                </span>
              </div>

              {/* Historial de chat */}
              {chatMessages.length > 0 && (
                <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                  {chatMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={`text-xs p-2 rounded-xl ${
                        msg.role === 'user'
                          ? 'bg-blue-600 text-white ml-6'
                          : 'bg-white text-slate-700 mr-6 border border-slate-200'
                      }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {chatLoading && (
                    <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Loader2 size={12} className="animate-spin" />
                      Pensando…
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
              )}

              {/* Input */}
              <div className="flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChat(); } }}
                  placeholder="¿Dudas?"
                  className="flex-1 text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-400 transition-colors"
                  disabled={chatLoading}
                />
                <button
                  onClick={handleSendChat}
                  disabled={chatLoading || !chatInput.trim()}
                  className="p-2 bg-[#1e2b7a] text-white rounded-xl hover:bg-blue-700 disabled:opacity-40 transition-colors"
                  aria-label="Enviar pregunta"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* ── SMART QUIZ ── */}
            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Brain size={14} className="text-[#1e2b7a]" />
                <span className="text-[10px] font-black uppercase tracking-widest text-[#1e2b7a]">
                  Smart Quiz
                </span>
              </div>

              {quiz.length === 0 ? (
                <button
                  onClick={handleGenerateQuiz}
                  disabled={quizLoading}
                  className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-xs font-black uppercase tracking-wider text-blue-500 hover:border-blue-500 hover:text-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                  {quizLoading
                    ? <><Loader2 size={12} className="animate-spin" /> Generando quiz…</>
                    : <><Brain size={12} /> ✨ PONERME A PRUEBA</>
                  }
                </button>
              ) : activeQuizIdx >= quiz.length ? (
                <div className="text-center text-green-600 font-black text-sm py-4">
                  🎉 ¡Quiz completado!
                  <button
                    onClick={() => { setQuiz([]); setActiveQuizIdx(0); setSelectedAnswer(null); }}
                    className="block mx-auto mt-2 text-[10px] text-slate-400 underline"
                  >
                    Repetir
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-bold text-[#1e2b7a] leading-snug">
                    <span className="text-slate-400 font-normal">
                      {activeQuizIdx + 1}/{quiz.length} —{' '}
                    </span>
                    {quiz[activeQuizIdx].question}
                  </p>
                  <div className="space-y-2">
                    {quiz[activeQuizIdx].options.map((opt, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect  = idx === quiz[activeQuizIdx].answer;
                      const revealed   = selectedAnswer !== null;

                      let style = 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-300';
                      if (revealed && isCorrect)                  style = 'bg-green-50 border-green-400 text-green-800';
                      else if (revealed && isSelected && !isCorrect) style = 'bg-red-50 border-red-400 text-red-700';

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          disabled={revealed}
                          className={`w-full text-left text-xs px-3 py-2 border rounded-xl transition-colors flex items-center gap-2 ${style}`}
                        >
                          {revealed && isCorrect  && <CheckCircle size={12} className="text-green-600 shrink-0" />}
                          {revealed && isSelected && !isCorrect && <XCircle size={12} className="text-red-500 shrink-0" />}
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  {selectedAnswer !== null && activeQuizIdx < quiz.length - 1 && (
                    <button
                      onClick={handleNextQuestion}
                      className="w-full py-2 bg-[#1e2b7a] text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-blue-700 transition-colors"
                    >
                      Siguiente →
                    </button>
                  )}
                  {selectedAnswer !== null && activeQuizIdx === quiz.length - 1 && (
                    <button
                      onClick={() => setActiveQuizIdx(quiz.length)}
                      className="w-full py-2 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-green-700 transition-colors"
                    >
                      Finalizar ✓
                    </button>
                  )}
                </div>
              )}
            </div>

          </div>

          {/* Pie: botones de acción */}
          <div className="p-5 border-t border-slate-100 flex gap-3">
            <a
              href={item.link ?? mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-[#1e2b7a] text-white rounded-xl font-black text-xs uppercase tracking-wider text-center hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Eye size={14} /> VER AHORA
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(item.link ?? mediaUrl ?? window.location.href);
              }}
              className="px-4 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
              aria-label="Compartir enlace"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ContentViewer;
