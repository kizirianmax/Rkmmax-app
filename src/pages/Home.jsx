// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import agents from "../data/agents";

export default function Home() {
  const container = {
    maxWidth: 920,
    margin: "0 auto",
    padding: 16,
  };

  const title = {
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 8,
  };

  const subtitle = {
    color: "#555",
    marginBottom: 16,
  };

  const list = {
    display: "grid",
    gridTemplateColumns: "1fr",
    gap: 12,
  };

  const card = {
    display: "block",
    textDecoration: "none",
    color: "inherit",
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 14,
    transition: "background 120ms ease",
  };

  const name = { fontSize: 18, fontWeight: 700, marginBottom: 4 };
  const desc = { fontSize: 14, color: "#666" };

  return (
    <main style={container}>
      <h1 style={title}>Bem-vindo ao RKMMAX 🚀</h1>
      <p style={subtitle}>Escolha um dos 12 agentes abaixo para conversar.</p>

      <div style={list}>
        {agents.map((a) => (
          <Link key={a.id} to={`/agents/${a.id}`} style={card}>
            <div style={name}>{a.name}</div>
            <div style={desc}>{a.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
