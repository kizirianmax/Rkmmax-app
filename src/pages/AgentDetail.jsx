// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import agents from "../data/agents";

// mesma paleta para sincronizar o detalhe com a Home
const COLORS = {
  emo: "#38A169",
  didak: "#3182CE",
  finna: "#2F855A",
  care: "#E53E3E",
  criar: "#DD6B20",
  code: "#2B6CB0",
  talky: "#805AD5",
  focus: "#D69E2E",
  bizu: "#319795",
  legalis: "#4A5568",
  planx: "#D69E2E",
  orac: "#6D28D9",
  serginho: "#B45309",
};

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);
  const accent = COLORS[id] || "#111827";

  const container = {
    maxWidth: 980,
    margin: "0 auto",
    padding: "24px 16px",
  };

  const title = {
    fontSize: 32,
    lineHeight: 1.2,
    fontWeight: 800,
    marginBottom: 12,
    color: accent,
  };

  const desc = { color: "#475569", fontSize: 16, marginBottom: 24 };

  const back = {
    color: "#2563EB",
    textDecoration: "underline",
    marginTop: 24,
    display: "inline-block",
  };

  if (!agent) {
    return (
      <main style={container}>
        <h1 style={{ ...title, color: "#DC2626" }}>Agente não encontrado</h1>
        <Link to="/" style={back}>Voltar para a Home</Link>
      </main>
    );
  }

  return (
    <main style={container}>
      <h1 style={title}>{agent.name}</h1>
      <p style={desc}>{agent.description}</p>

      {/* 🔥 bloco especial só para o Serginho */}
      {agent.id === "serginho" && (
        <div
          style={{
            padding: 16,
            marginBottom: 24,
            borderRadius: 12,
            background: "#FFFBEB",
            border: "1px solid #FDE68A",
          }}
        >
          <p style={{ color: "#B45309", fontWeight: 600 }}>
            👋 Oi, eu sou o Serginho, cheguei para somar aqui no RKMMAX 😎🚀
          </p>
        </div>
      )}

      {/* botão de “conversar” (placeholder) */}
      <Link
        to="/"
        style={{
          display: "inline-block",
          padding: "10px 16px",
          borderRadius: 10,
          background: accent,
          color: "white",
          textDecoration: "none",
          boxShadow: "0 6px 18px rgba(0,0,0,.12)",
        }}
      >
        Iniciar conversa
      </Link>

      <div style={{ height: 12 }} />
      <Link to="/" style={back}>Voltar para a Home</Link>
    </main>
  );
}
