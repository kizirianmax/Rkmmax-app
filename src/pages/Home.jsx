// src/pages/Home.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import agents from "../data/agents";

// 🎨 paleta por agente (ajuste as cores à vontade)
const COLORS = {
  emo:      { border: "#9AE6B4", bg: "#F0FFF4", hover: "#E6FFFA", shadow: "rgba(56, 161, 105, .25)" },
  didak:    { border: "#90CDF4", bg: "#EBF8FF", hover: "#E6FFFA", shadow: "rgba(66, 153, 225, .25)" },
  finna:    { border: "#68D391", bg: "#F0FFF4", hover: "#F0FFF4", shadow: "rgba(56, 161, 105, .25)" },
  care:     { border: "#FEB2B2", bg: "#FFF5F5", hover: "#FFF5F5", shadow: "rgba(245, 101, 101, .25)" },
  criar:    { border: "#F6AD55", bg: "#FFFAF0", hover: "#FFF5F5", shadow: "rgba(221, 107, 32, .25)" },
  code:     { border: "#63B3ED", bg: "#EBF8FF", hover: "#E6FFFA", shadow: "rgba(49, 130, 206, .25)" },
  talky:    { border: "#B794F4", bg: "#FAF5FF", hover: "#F7FAFC", shadow: "rgba(128, 90, 213, .25)" },
  focus:    { border: "#FBD38D", bg: "#FFFAF0", hover: "#FFF5F5", shadow: "rgba(214, 158, 46, .25)" },
  bizu:     { border: "#81E6D9", bg: "#EDFDFD", hover: "#E6FFFA", shadow: "rgba(49, 151, 149, .25)" },
  legalis:  { border: "#A0AEC0", bg: "#F7FAFC", hover: "#EDF2F7", shadow: "rgba(113, 128, 150, .25)" },
  planx:    { border: "#F6E05E", bg: "#FFFFF0", hover: "#FFF5F5", shadow: "rgba(214, 158, 46, .25)" },
  orac:     { border: "#C4B5FD", bg: "#FAF5FF", hover: "#F7FAFC", shadow: "rgba(139, 92, 246, .25)" },
  serginho: { border: "#FDE68A", bg: "#FFFBEB", hover: "#FEF3C7", shadow: "rgba(217, 119, 6, .25)" },
};

export default function Home() {
  const [hoverId, setHoverId] = useState(null);

  // — estilos base
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
    letterSpacing: "0.06em",
  };

  const subtitle = {
    color: "#555",
    marginBottom: 24,
  };

  const grid = {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  };

  const cardBase = {
    display: "block",
    padding: 16,
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    background: "#fff",
    textDecoration: "none",
    color: "inherit",
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
    transition: "all .18s ease",
  };

  const name = {
    fontWeight: 700,
    marginBottom: 6,
  };

  const description = {
    color: "#475569",
    fontSize: 14,
    lineHeight: 1.45,
  };

  return (
    <main style={container}>
      <h1 style={title}>Bem-vindo ao R K M M A X 🚀</h1>
      <p style={subtitle}>Escolha um dos agentes abaixo para conversar.</p>

      <div style={grid}>
        {agents.map((a) => {
          const pal = COLORS[a.id] || { border: "#e5e7eb", bg: "#fff", hover: "#fff", shadow: "rgba(0,0,0,.08)" };
          const isHover = hoverId === a.id;

          const card = {
            ...cardBase,
            borderColor: pal.border,
            background: isHover ? pal.hover : pal.bg,
            transform: isHover ? "translateY(-2px)" : "none",
            boxShadow: isHover ? `0 8px 22px ${pal.shadow}` : cardBase.boxShadow,
          };

          return (
            <Link
              key={a.id}
              to={`/agents/${a.id}`}
              style={card}
              onMouseEnter={() => setHoverId(a.id)}
              onMouseLeave={() => setHoverId(null)}
            >
              <div style={{ ...name, color: "#111827" }}>{a.name}</div>
              <div style={description}>{a.description}</div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
