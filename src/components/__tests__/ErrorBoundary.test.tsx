// src/components/__tests__/ErrorBoundary.test.tsx
// ================================================================
// Como testeamos un ErrorBoundary?
// Creamos un componente que lanza un error deliberadamente
// y comprobamos que ErrorBoundary lo captura correctamente.
//
// NOTA: React imprime el error en consola incluso en tests.
// Silenciamos console.error durante estos tests para no ensuciar
// la salida, pero los tests funcionan correctamente.
// ================================================================

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "../ErrorBoundary";

// Componente que lanza un error cuando se le dice
const ComponenteQueExplota = ({ debeExplotar }: { debeExplotar: boolean }) => {
  if (debeExplotar) {
    throw new Error("Error de prueba controlado");
  }
  return <div>Componente funcionando correctamente</div>;
};

// Silenciar console.error para no ensuciar la salida de tests
// React imprime el error incluso cuando esta capturado por ErrorBoundary
let consoleErrorSpy: jest.SpyInstance;
beforeEach(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe("ErrorBoundary", () => {

  // ── Test 1: Sin error, renderiza los hijos ───────────────────
  it("renderiza los hijos correctamente cuando no hay error", () => {
    render(
      <ErrorBoundary>
        <ComponenteQueExplota debeExplotar={false} />
      </ErrorBoundary>
    );

    expect(
      screen.getByText("Componente funcionando correctamente")
    ).toBeInTheDocument();
  });

  // ── Test 2: Con error, muestra el fallback ───────────────────
  it("muestra el mensaje de error cuando un hijo lanza un error", () => {
    render(
      <ErrorBoundary sectionName="Retos">
        <ComponenteQueExplota debeExplotar={true} />
      </ErrorBoundary>
    );

    // Debe mostrar el mensaje de error, no el hijo
    expect(
      screen.getByText("Error en Retos")
    ).toBeInTheDocument();

    // El hijo no debe estar visible
    expect(
      screen.queryByText("Componente funcionando correctamente")
    ).not.toBeInTheDocument();
  });

  // ── Test 3: El mensaje es legible y util ─────────────────────
  it("muestra un mensaje explicativo y el boton de reintentar", () => {
    render(
      <ErrorBoundary>
        <ComponenteQueExplota debeExplotar={true} />
      </ErrorBoundary>
    );

    // Debe haber un boton de reintentar
    expect(
      screen.getByRole("button", { name: /reintentar/i })
    ).toBeInTheDocument();

    // Debe tener role="alert" para lectores de pantalla
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  // ── Test 4: Reintentar resetea el estado de error ───────────
  it("el boton Reintentar resetea el estado de error", () => {
    // Usamos un wrapper que nos permite cambiar el prop tras el rerender
    const { rerender } = render(
      <ErrorBoundary>
        <ComponenteQueExplota debeExplotar={true} />
      </ErrorBoundary>
    );

    // Hay error
    expect(screen.getByRole("alert")).toBeInTheDocument();

    // Re-renderizamos con el componente sin error ANTES de hacer click,
    // para que al reintentar el hijo ya no lance.
    rerender(
      <ErrorBoundary>
        <ComponenteQueExplota debeExplotar={false} />
      </ErrorBoundary>
    );

    // Hacemos click en Reintentar: el ErrorBoundary limpia su estado
    fireEvent.click(screen.getByRole("button", { name: /reintentar/i }));

    // Ya no hay error, vemos el componente normal
    expect(
      screen.getByText("Componente funcionando correctamente")
    ).toBeInTheDocument();
  });

});
