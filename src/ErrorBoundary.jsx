// src/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary capturou um erro:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            background: "#ffe6e6",
            border: "2px solid #ff4d4f",
            borderRadius: 12,
            margin: 24,
            fontFamily: "Arial, sans-serif",
            color: "#a8071a",
          }}
        >
          <h2>⚠️ Algo deu errado</h2>
          <p>Tente atualizar a página ou voltar mais tarde.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
