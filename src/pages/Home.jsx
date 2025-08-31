// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import agents from "../data/agents";

// 🎨 paleta por agente (ajuste as cores à vontade)
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

// 🔣 ícone por agente (sem dependências)
const ICONS = {
  emo: "💙",
  didak: "📘",
  finna: "💸",
  care: "🩺",
  criar: "✨",
  code: "💻",
  talky: "💬",
  focus: "🎯",
  bizu: "📝",
  legalis: "⚖️",
  planx: "🗺️",
  orac: "🔮",
  serginho: "🧩",
};

export default function Home() {
  // container
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
    marginBottom: 24,
  };

  // grid responsivo
  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 16,
  };

  // base do card (as cores vêm do mapa)
  const baseCard = (id) => ({
    background: COLORS[id]?.bg || "#fff",
    border: `1px solid ${COLORS[id]?.border || "#e5e7eb"}`,
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
    transition: "transform .15s ease, box-shadow .15s ease",
    textDecoration: "none",
    color: "inherit",
    display: "block",
  });

  const name = { fontWeight: 700, marginBottom: 6, display: "flex", gap: 8, alignItems: "center" };
  const desc = { color: "#4B5563", fontSize: 14, lineHeight: 1.5 };

  const footer = {
    marginTop: 36,
    padding: "16px 0",
    borderTop: "1px solid #eee",
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
  };

  return (
    <main style={container}>
      {/* CSS leve para hover/active */}
      <style>{`
        .agent-card:hover { transform: translateY(-2px) scale(1.02); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
        .agent-card:active { transform: translateY(0) scale(0.99); box-shadow: 0 2px 10px rgba(0,0,0,.06); }
      `}</style>

      <h1 style={title}>Bem-vindo ao R K M M A X 🚀</h1>
      <p style={subtitle}>Escolha um dos agentes abaixo para conversar.</p>

      <section style={grid}>
        {agents.map((agent) => (
          <Link
            key={agent.id}
            to={`/agents/${agent.id}`}
            className="agent-card"
            style={baseCard(agent.id)}
          >
            <div style={name}>
              <span style={{ fontSize: 18 }}>{ICONS[agent.id] || "🤖"}</span>
              <span>{agent.name}</span>
            </div>
            <p style={desc}>{agent.description}</p>
          </Link>
        ))}
      </section>

      <footer style={footer}>
        RKMMax — Sistema de IA Modular • © 2025 Roberto K.
      </footer>
    </main>
  );
}
