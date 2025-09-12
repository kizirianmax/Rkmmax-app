// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import AGENTS from "../data/agents";

const WHATSAPP_NUMBER = "55SEUNUMEROAQUI"; // coloque aqui seu número com DDI+DDD

function openWhatsApp(agentName) {
  const text = `Quero falar com o agente ${agentName}`;
  const appDeepLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(
    text
  )}`;
  const webFallback = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    text
  )}`;

  window.location.href = appDeepLink;
  setTimeout(() => {
    window.open(webFallback, "_blank", "noopener,noreferrer");
  }, 600);
}

export default function AgentDetail() {
  const { id } = useParams();
  const agent = AGENTS.find((a) => a.id === id);

  if (!agent) {
    return (
      <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
        <h1>Agente não encontrado</h1>
        <Link to="/agents" style={{ color: "#15d0d4" }}>
          ← Voltar
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <Link to="/agents" style={{ color: "#15d0d4" }}>
        ← Voltar
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
        <img
          src={agent.avatar_url}
          alt={agent.name}
          width={60}
          height={60}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <h2 style={{ margin: 0 }}>{agent.name}</h2>
          <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{agent.role}</p>
        </div>
      </div>
      <p style={{ marginTop: 12 }}>{agent.description}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 20 }}>
        <Link
          to={`/chat/${agent.id}`}
          style={{
            flex: 1,
            textAlign: "center",
            textDecoration: "none",
            color: "#e6eef5",
            border: "1px solid #15d0d4",
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(21,208,212,.15)",
            fontWeight: 600,
          }}
        >
          💬 Chat no app
        </Link>
        <button
          onClick={() => openWhatsApp(agent.name)}
          style={{
            flex: 1,
            color: "#e6eef5",
            border: "1px solid #25d366",
            padding: "10px 14px",
            borderRadius: 8,
            background: "rgba(37,211,102,.15)",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          📲 WhatsApp
        </button>
      </div>
    </div>
  );
}
