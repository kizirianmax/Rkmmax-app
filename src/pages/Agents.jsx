// src/pages/Agents.jsx
import React from "react";
import { Link } from "react-router-dom";
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

export default function Agents() {
  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <h1 style={{ marginBottom: 24 }}>Lista de Agentes</h1>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
        }}
      >
        {AGENTS.map((a) => (
          <div
            key={a.id}
            style={{
              background: "rgba(255,255,255,.05)",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 8px 18px rgba(0,0,0,.25)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={a.avatar_url}
                alt={a.name}
                width={50}
                height={50}
                style={{ borderRadius: "50%", objectFit: "cover" }}
              />
              <div>
                <h3 style={{ margin: 0 }}>{a.name}</h3>
                <p style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{a.role}</p>
              </div>
            </div>
            <p style={{ marginTop: 12, fontSize: 14 }}>{a.description}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <Link
                to={`/chat/${a.id}`}
                style={{
                  flex: 1,
                  textAlign: "center",
                  textDecoration: "none",
                  color: "#e6eef5",
                  border: "1px solid #15d0d4",
                  padding: "8px 14px",
                  borderRadius: 8,
                  background: "rgba(21,208,212,.15)",
                  fontWeight: 600,
                }}
              >
                💬 Chat no app
              </Link>
              <button
                onClick={() => openWhatsApp(a.name)}
                style={{
                  flex: 1,
                  color: "#e6eef5",
                  border: "1px solid #25d366",
                  padding: "8px 14px",
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
        ))}
      </div>
    </div>
  );
}
