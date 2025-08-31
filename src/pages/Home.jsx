// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import agents from "../data/agents";

export default function Home() {
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

  const grid = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 16,
  };

  const card = {
    display: "block",
    textDecoration: "none",
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    padding: 16,
    background: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    transition: "transform .12s ease, box-shadow .12s ease, border-color .12s",
  };

  const cardHover = {
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(0,0,0,0.06)",
    borderColor: "#d1d5db",
  };

  const name = { fontSize: 18, fontWeight: 700, marginBottom: 6, color: "#111827" };
  const desc = { fontSize: 14, color: "#4b5563", lineHeight: 1.5 };

  // pequeno helper para hover inline
  const withHover = (base) => {
    const node = { ...base };
    return {
      ...node,
      onMouseEnter: (e) => Object.assign(e.currentTarget.style, cardHover),
      onMouseLeave: (e) => Object.assign(e.currentTarget.style, base),
    };
  };

  const badge = { marginRight: 8 };

  const emojis = {
    emo: "💙",
    didak: "📚",
    finna: "💸",
    care: "🩺",
    criar: "✨",
    code: "💻",
    talky: "🗣️",
    focus: "🎯",
    bizu: "📝",
    legalis: "⚖️",
    planx: "🧭",
    orac: "🔮",
    serginho: "🤖",
  };

  return (
    <main style={container}>
      <h1 style={title}>Bem-vindo ao R K M M A X 🚀</h1>
      <p style={subtitle}>
        Escolha um dos agentes abaixo para conversar.
      </p>

      <div style={grid}>
        {agents.map((a) => (
          <Link
            key={a.id}
            to={`/agents/${a.id}`}
            style={withHover(card)}
            aria-label={`Abrir agente ${a.name}`}
          >
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <span style={badge}>{emojis[a.id] || "🤖"}</span>
              <span style={name}>{a.name}</span>
            </div>
            <p style={desc}>{a.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
