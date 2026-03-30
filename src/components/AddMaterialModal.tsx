// src/components/AddMaterialModal.tsx
import React, { useState } from "react";
import { X, Sparkles, Paperclip } from "lucide-react";

interface Props {
  category: string | null;
  onClose: () => void;
  onAdd: (category: string | null, item: { title: string; description: string; mediaUrl: string; mediaType: string }) => void;
  suggestDescription: (title: string, setDesc: (desc: string) => void) => void;
  isAiLoading: boolean;
}

const AddMaterialModal: React.FC<Props> = ({ category, onClose, onAdd, suggestDescription, isAiLoading }) => {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState("video");
  const [fileName, setFileName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd(category, { title, description: desc, mediaUrl: url, mediaType: type });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const fakeUrl = URL.createObjectURL(file);
      setUrl(fakeUrl);
    }
  };

  return (
    // Backdrop: aria-hidden porque es decorativo, el contenido real es el form
    <div
      className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <form
        className="bg-white rounded-[2.5rem] w-full max-w-sm p-10 shadow-2xl text-[#1e2b7a]"
        onClick={e => e.stopPropagation()}
        onSubmit={handleSubmit}
        aria-label="Anadir nuevo material a la Academy"
        aria-hidden="false"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-black uppercase italic leading-none" id="modal-title">ANADIR MATERIAL</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-slate-400 hover:text-[#1e2b7a] transition-colors"
          >
            <X size={24} aria-hidden="true"/>
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl" role="group" aria-label="Tipo de material">
            <button type="button" onClick={() => setType("video")} aria-pressed={type === "video"} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${type === "video" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>VIDEO</button>
            <button type="button" onClick={() => setType("pdf")} aria-pressed={type === "pdf"} className={`flex-1 py-2 rounded-lg font-black text-[10px] transition-all ${type === "pdf" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}>DOC / PDF</button>
          </div>

          <label htmlFor="material-title" className="sr-only">Titulo del material</label>
          <input
            id="material-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]"
            placeholder="Titulo del bloque..."
            required
            aria-required="true"
          />

          <div className="relative">
            <label htmlFor="material-desc" className="sr-only">Descripcion del material</label>
            <textarea
              id="material-desc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none h-24 font-medium text-sm text-[#1A202C] pr-10"
              placeholder="Descripcion tecnica..."
              required
              aria-required="true"
            />
            <button
              type="button"
              onClick={() => suggestDescription(title, setDesc)}
              disabled={isAiLoading}
              aria-label="Sugerir descripcion con IA"
              aria-busy={isAiLoading}
              className="absolute bottom-2 right-2 p-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:opacity-30 transition-all"
            >
              <Sparkles size={14} aria-hidden="true" />
            </button>
          </div>

          <label className="flex flex-col items-center justify-center gap-2 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group">
            <Paperclip size={20} className="text-blue-500 group-hover:scale-110 transition-transform" aria-hidden="true" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none text-center">
              {fileName ? <span className="text-blue-600">{fileName}</span> : "Subir archivo desde PC"}
            </span>
            <input
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.png,.jpg"
              onChange={handleFileUpload}
              aria-label="Seleccionar archivo desde tu ordenador"
            />
          </label>

          <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase italic shadow-lg mt-4 hover:bg-blue-700 transition-colors">
            PUBLICAR EN ACADEMY
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMaterialModal;
