import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// ── Seed helper (solo en desarrollo) ─────────────────────────────────────────
// Ejecutar UNA SOLA VEZ desde DevTools:  await window.__seedSupabase()
// Eliminar este bloque después del seeding.
if (process.env.NODE_ENV === 'development') {
  import('./data/seedSupabase').then(({ seedSupabase }) => {
    (window as Window & { __seedSupabase?: () => Promise<void> }).__seedSupabase = seedSupabase;
    console.info('[dev] Seed disponible → await window.__seedSupabase()');
  });
}
// ─────────────────────────────────────────────────────────────────────────────

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
