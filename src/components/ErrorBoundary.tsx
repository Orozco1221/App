// src/components/ErrorBoundary.tsx
// ================================================================
// QUE ES UN ERROR BOUNDARY?
// Es un componente especial de React que "atrapa" los errores
// que ocurren en sus componentes hijos, evitando que la pantalla
// quede completamente en blanco.
//
// Por que es una CLASS y no una funcion?
// React solo permite ErrorBoundaries como clases porque necesita
// el metodo de ciclo de vida componentDidCatch, que aun no existe
// como hook. Es la unica excepcion donde usamos clases en este proyecto.
// ================================================================

import React from "react";

interface Props {
  children: React.ReactNode;
  sectionName?: string;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      errorMessage: error?.message || "Error desconocido",
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("[ErrorBoundary] Error capturado:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          className="flex flex-col items-center justify-center p-12 m-6 bg-white rounded-[2rem] border border-red-100 shadow-sm"
        >
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-red-400 text-2xl font-black">!</span>
          </div>
          <h2 className="text-xl font-black uppercase italic text-[#1e2b7a] mb-3 leading-none">
            {this.props.sectionName
              ? `Error en ${this.props.sectionName}`
              : "Algo ha ido mal"}
          </h2>
          <p className="text-sm text-slate-400 text-center leading-relaxed mb-6 max-w-xs">
            Esta seccion ha encontrado un problema inesperado.
            El resto de la app sigue funcionando correctamente.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
            className="px-8 py-3 bg-[#3b82f6] text-white rounded-xl font-black uppercase text-xs italic tracking-widest hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
