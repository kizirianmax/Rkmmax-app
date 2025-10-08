// src/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    // aparece no console também
    console.error("App crash:", error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const showDebug =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("debug") === "1";

    return (
      <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
        <h1 style={{ marginBottom: 8 }}>Algo deu errado</h1>
        {!showDebug ? (
          <>
            <p>Tente atualizar a página.</p>
            <p>
              Para ver detalhes do erro, abra{" "}
              <a href="?debug=1">esta página com ?debug=1</a>.
            </p>
          </>
        ) : (
          <>
            <h2>Detalhes</h2>
            <pre style={{ whiteSpace: "pre-wrap" }}>
              {String(error?.message || error)}
            </pre>
            {error?.stack && (
              <>
                <h3>Stack</h3>
                <pre style={{ whiteSpace: "pre-wrap" }}>{error.stack}</pre>
              </>
            )}
          </>
        )}
      </div>
    );
  }
}
