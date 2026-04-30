// src/components/AddMaterialModal.tsx
import React, { useState } from "react";
import { X, Sparkles, Paperclip, Loader2 } from "lucide-react";

interface Props {
  category: string | null;
  onClose: () => void;
  onAdd: (
    category: string | null,
    item: { title: string; description: string; mediaUrl: string; mediaType: string },
    file?: File | null,
  ) => Promise<void>;
  suggestDescription: (title: string, setDesc: (desc: string) => void) => void;
  isAiLoading: boolean;
}

// Detecta el tipo de media por extensión del fichero
function detectMediaType(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf')                return 'pdf';
  if (ext === 'ppt' || ext === 'pptx') return 'ppt';
  if (ext === 'mp4')                return 'mp4';
  if (['jpg','jpeg','png','gif','webp'].includes(ext)) return 'image';
  if (['doc','docx'].includes(ext)) return 'doc';
  if (['xls','xlsx'].includes(ext)) return 'excel';
  return 'file';
}

const AddMaterialModal: React.FC<Props> = ({
  category, onClose, onAdd, suggestDescription, isAiLoading,
}) => {
  const [title,    setTitle]    = useState('');
  const [desc,     setDesc]     = useState('');
  const [url,      setUrl]      = useState('');
  const [file,     setFile]     = useState<File | null>(null);
  const [fileName, setFileName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setFileName(f.name);
    setUrl('');
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFileName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mediaType = file ? detectMediaType(file.name) : 'video';
    setIsSaving(true);
    try {
      await onAdd(category, { title, description: desc, mediaUrl: url, mediaType }, file);
    } finally {
      setIsSaving(false);
    }
  };

  return (
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
          <h3 className="text-xl font-black uppercase italic leading-none" id="modal-title">
            ANADIR MATERIAL
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="text-slate-400 hover:text-[#1e2b7a] transition-colors"
          >
            <X size={24} aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-4">

          {/* Título */}
          <label htmlFor="material-title" className="sr-only">Titulo del material</label>
          <input
            id="material-title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]"
            placeholder="Título del bloque..."
            required
            aria-required="true"
          />

          {/* Descripción con sugerencia IA */}
          <div className="relative">
            <label htmlFor="material-desc" className="sr-only">Descripcion del material</label>
            <textarea
              id="material-desc"
              value={desc}
              onChange={e => setDesc(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none h-24 font-medium text-sm text-[#1A202C] pr-10"
              placeholder="Descripción técnica..."
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

          {/* URL — visible solo cuando no hay fichero adjunto */}
          {!file && (
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              className="w-full p-4 bg-slate-50 border-none rounded-xl outline-none font-medium text-sm text-[#1A202C]"
              placeholder="URL del recurso (YouTube, web...)"
              type="url"
            />
          )}

          {/* Upload de fichero — acepta cualquier tipo */}
          <label className="flex flex-col items-center justify-center gap-2 p-6 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors group">
            <Paperclip
              size={20}
              className="text-blue-500 group-hover:scale-110 transition-transform"
              aria-hidden="true"
            />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest leading-none text-center">
              {fileName
                ? <span className="text-blue-600">{fileName}</span>
                : 'Subir archivo desde PC'}
            </span>
            <span className="text-[9px] text-slate-400">PDF · PPT · MP4 · Word · Excel · Imagen…</span>
            <input
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              aria-label="Seleccionar archivo desde tu ordenador"
            />
          </label>

          {/* Botón para quitar fichero seleccionado */}
          {file && (
            <button
              type="button"
              onClick={handleRemoveFile}
              className="w-full py-2 text-xs text-slate-400 hover:text-red-500 transition-colors"
            >
              Quitar archivo seleccionado
            </button>
          )}

          {/* Botón publicar */}
          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-black uppercase italic shadow-lg mt-4 hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <><Loader2 size={16} className="animate-spin" /> Subiendo…</>
            ) : (
              'PUBLICAR EN ACADEMY'
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default AddMaterialModal;
