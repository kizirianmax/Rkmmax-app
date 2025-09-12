import React from "react";
import { useParams, Link } from "react-router-dom";
import AGENTS from "../data/agents";

export default function AgentDetails() {
  const { id } = useParams();
  const agent = AGENTS.find((a) => a.id === id);

  if (!agent) {
    return (
      <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
        <h1 style={{ color: "#ff6b6b" }}>Agente não encontrado</h1>
        <Link to="/agents" style={{ color: "#15d0d4" }}>Voltar</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <Link to="/agents" style={{ color: "#15d0d4" }}>← Voltar</Link>
      <div style={{
        marginTop: 16, background: "rgba(255,255,255,0.06)",
        borderRadius: 12, padding: 20,
        boxShadow: "0 8px 18px rgba(0,0,0,0.25)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={agent.avatar_url}
            alt={agent.name}
            width={72}
            height={72}
            style={{ borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <div style={{ fontWeight: 800, fontSize: 20 }}>{agent.name}</div>
            <div style={{ fontSize: 13, opacity: 0.8 }}>{agent.role}</div>
          </div>
        </div>
        <p style={{ marginTop: 16, fontSize: 15, lineHeight: 1.6, color: "#ddd" }}>
          {agent.description}
        </p>
      </div>
    </div>
  );
}
