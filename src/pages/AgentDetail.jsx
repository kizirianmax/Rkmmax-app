// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import agents from "../data/agents";

// mesmas paletas e ícones da Home
const COLORS = {
  emo:    { border: "#9AE6B4", bg: "#F0FFF4" },
  didak:  { border: "#90CDF4", bg: "#EBF8FF" },
  finna:  { border: "#68D391", bg: "#F0FFF4" },
  care:   { border: "#FEB2B2", bg: "#FFF5F5" },
  criar:  { border: "#F6E05E", bg: "#FFFAF0" },
  code:   { border: "#A0AEC0", bg: "#F7FAFC" },
  talky:  { border: "#B794F4", bg: "#FAF5FF" },
  focus:  { border: "#FC8181", bg: "#FFF5F5" },
  bizu:   { border: "#63B3ED", bg: "#EBF8FF" },
  legalis:{ border: "#81E6D9", bg: "#E6FFFA" },
  planx:  { border: "#F6E05E", bg: "#FFFEF0" },
  orac:   { border: "#C4B5FD", bg: "#F5F3FF" },
  serginho:{ border: "#FBD38D", bg: "#FFFAF0" },
};

const ICONS = {
  emo: "💙", didak: "📘", finna: "💸", care: "🩺", criar: "✨", code: "💻",
  talky: "💬", focus: "🎯", bizu: "📝", legalis: "⚖️", planx: "🗺️",
  orac: "🔮", serginho: "🧩",
};

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  const container = { maxWidth: 980, margin: "0 auto", padding: "24px 16px" };
  const titleRow = { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 };
  const title = { fontSize: 32, lineHeight: 1.2, fontWeight: 800 };
  const subtitle = { color: "#4B5563", fontSize: 16, lineHeight: 1.6, marginBottom: 20 };
  const card = (id) => ({
    background: COLORS[id]?.bg || "#fff",
    border: `1px solid ${COLORS[id]?.border || "#e5e7eb"}`,
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
  });
  const backBtn = {
    display: "inline-block",
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    textDecoration: "none",
    color: "#1D4ED8",
    background: "#F8FAFC",
    transition: "transform .15s ease, box-shadow .15s ease",
  };

  if (!agent) {
    return (
      <main style={container}>
        <h1 style={{ ...title, color: "#DC2626" }}>Agente não encontrado</h1>
        <Link to="/" style={backBtn}>Voltar para a Home</Link>
      </main>
    );
  }

  return (
    <main style={container}>
      <style>{`
        .back:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
        .back:active { transform: translateY(0) scale(.99); }
      `}</style>

      {/* Cabeçalho com ícone */}
      <div style={titleRow}>
        <div style={{ fontSize: 26 }}>{ICONS[agent.id] || "🤖"}</div>
        <h1 style={title}>{agent.name}</h1>
      </div>
      <p style={subtitle}>{agent.description}</p>

      {/* Card principal (informações básicas) */}
      <section style={card(agent.id)}>
        <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.7 }}>
          Aqui é a página do agente <strong>{agent.name}</strong>.  
          Você pode evoluir este espaço com recursos como: histórico de conversa, prompts
          específicos, atalhos e integrações (ex.: Supabase, planilhas, etc.).
        </p>

        {/* Bloco especial só para o Serginho */}
        {agent.id === "serginho" && (
          <div
            style={{
              marginTop: 16,
              padding: 14,
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              borderRadius: 10,
            }}
          >
            <p style={{ color: "#92400E", fontWeight: 600 }}>
              👋 Oi, eu sou o Serginho, cheguei para somar aqui no RKMMax 😎🚀
            </p>
          </div>
        )}
      </section>

      <Link to="/" className="back" style={backBtn}>Voltar para a Home</Link>
    </main>
  );
}
