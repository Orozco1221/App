// src/components/ErrorBoundary.js
// ================================================================
// QUE ES UN ERROR BOUNDARY?
// Es un componente especial de React que "atrapa" los errores
// que ocurren en sus componentes hijos, evitando que la pantalla
// quede completamente en blanco.
//
// SIN ErrorBoundary: si Gemini devuelve algo raro y el componente
// de Retos explota, TODA la app muestra una pantalla en blanco.
//
// CON ErrorBoundary: el error queda aislado en su seccion.
// El resto de la app (Academy, Foro, Ranking) sigue funcionando.
//
// Por que es una CLASS y no una funcion?
// React solo permite ErrorBoundaries como clases porque necesita
// el metodo de ciclo de vida componentDidCatch, que aun no existe
// como hook. Es la unica excepcion donde usamos clases en este proyecto.
// ================================================================

import React from "react";
import PropTypes from "prop-types";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    // hasError: true cuando se ha capturado un error
    this.state = { hasError: false, errorMessage: "" };
  }

  // React llama a este metodo cuando un hijo lanza un error.
  // Debe devolver el nuevo estado del componente.
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      errorMessage: error?.message || "Error desconocido",
    };
  }

  // Se ejecuta despues de capturar el error.
  // Ideal para enviarlo a un sistema de monitorizacion (Sentry, etc.)
  componentDidCatch(error, errorInfo) {
    console.error("[ErrorBoundary] Error capturado:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Mostramos el fallback personalizado o uno generico
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

ErrorBoundary.propTypes = {
  // Los componentes hijos que envuelve
  children: PropTypes.node.isRequired,
  // Nombre de la seccion para el mensaje de error (opcional)
  sectionName: PropTypes.string,
  // Componente de fallback personalizado (opcional)
  fallback: PropTypes.node,
};

ErrorBoundary.defaultProps = {
  sectionName: "",
  fallback: null,
};

export default ErrorBoundary;
