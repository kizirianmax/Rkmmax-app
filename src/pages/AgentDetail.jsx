// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import agents from "../data/agents";

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  // --- estilos alinhados com a Home ---
  const container = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px",
  };

  const title = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 12,
  };

  const description = {
    fontSize: 18,
    color: "#555",
    marginBottom: 24,
  };

  const button = {
    display: "inline-block",
    padding: "12px 20px",
    background: "#2563eb",
    color: "#fff",
    borderRadius: 8,
    fontWeight: 600,
    textDecoration: "none",
  };

  if (!agent) {
    return (
      <main style={container}>
        <h1 style={title}>Agente não encontrado</h1>
        <Link to="/" style={button}>
          Voltar para a Home
        </Link>
      </main>
    );
  }

  return (
    <main style={container}>
      <h1 style={title}>{agent.name}</h1>
      <p style={description}>{agent.description}</p>

      {/* 🔥 Bloco especial só para o Serginho */}
      {agent.id === "serginho" && (
        <div
          style={{
            padding: "16px",
            marginBottom: "20px",
            borderRadius: "8px",
            background: "#fef9c3",
            border: "1px solid #facc15",
          }}
        >
          <p style={{ color: "#ca8a04", fontWeight: 600 }}>
            👋 Oi, eu sou o Serginho, cheguei para somar aqui no RKMMAX 😎🚀
          </p>
        </div>
      )}

      <Link to="/" style={button}>
        Voltar para a Home
      </Link>
      <br />
      <br />
      <a href="#" style={button}>
        Iniciar conversa
      </a>
    </main>
  );
}
