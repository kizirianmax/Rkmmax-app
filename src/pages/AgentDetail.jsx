// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import agents from "../data/agents";

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  // --- estilos no mesmo espírito da Home ---
  const container = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px",
  };

  const title = {
    fontSize: 36,
    lineHeight: 1.2,
    fontWeight: 800,
    marginBottom: 8,
  };

  const subtitle = {
    color: "#555",
    fontSize: 18,
    marginBottom: 24,
  };

  const card = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    marginBottom: 16,
  };

  const backLink = {
    color: "#2563eb",
    textDecoration: "underline",
    marginTop: 16,
    display: "inline-block",
  };

  if (!agent) {
    return (
      <main style={container}>
        <div style={card}>
          <h1 style={{ ...title, color: "#dc2626" }}>Agente não encontrado</h1>
          <Link to="/" style={backLink}>
            Voltar para a Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={container}>
      <div style={card}>
        <h1 style={title}>{agent.name}</h1>
        <p style={subtitle}>{agent.description}</p>

        {/* 🔥 bloco especial para o Serginho */}
        {agent.id === "serginho" && (
          <div
            style={{
              padding: 16,
              marginTop: 16,
              marginBottom: 8,
              borderRadius: 10,
              background: "#fef9c3", // yellow-100
              border: "1px solid #facc15", // yellow-400
            }}
          >
            <p style={{ color: "#a16207", fontWeight: 600 }}>
              👋 Oi, eu sou o Serginho, cheguei para somar aqui no RKMMax 😎🚀
            </p>
          </div>
        )}

        <Link to="/" style={backLink}>
          Voltar para a Home
        </Link>
      </div>
    </main>
  );
}
