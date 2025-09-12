// src/pages/Agents.jsx
import React from "react";
import { Link } from "react-router-dom";
import AGENTS from "../data/agents";

// ===== Configurações =====
const SHOW_HUMAN_SUPPORT = true;                 // torne false para ocultar
const WHATSAPP_NUMBER = "55SEUNUMEROAQUI";       // DDI+DDD+número, ex: 5511999999999

function openWhatsAppEmergency(agent) {
  const text = agent?.id === "serginho"
    ? "Suporte crítico: preciso de ajuda com meu projeto (Serginho)."
    : `Suporte crítico sobre o especialista ${agent?.name} (orquestrado pelo Serginho).`;

  const appDeepLink = `whatsapp://send?phone=${WHATSAPP_NUMBER}&text=${encodeURIComponent(text)}`;
  const webFallback = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

  // Tenta abrir o app primeiro
  window.location.href = appDeepLink;
  // Fallback web
  setTimeout(() => {
    window.open(webFallback, "_blank", "noopener,noreferrer");
  }, 600);
}

export default function Agents() {
  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <h1 style={{ marginBottom: 24, textAlign: "center" }}>Lista de Agentes</h1>
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
              display: "flex",
              flexDirection: "column",
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
                <div style={{ fontWeight: 700 }}>
                  {a.name}{" "}
                  {a.principal && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: 12,
                        padding: "2px 8px",
                        borderRadius: 999,
                        background: "rgba(21,208,212,.15)",
                        color: "#15d0d4",
                      }}
                    >
                      Principal
                    </span>
                  )}
                </div>
                <div style={{ margin: 0, fontSize: 13, opacity: 0.8 }}>{a.role}</div>
              </div>
            </div>

            <p style={{ marginTop: 12, fontSize: 14, color: "#ddd" }}>{a.description}</p>

            {/* Ação principal */}
            <div style={{ marginTop: "auto", display: "flex", gap: 8 }}>
              <Link
                to={`/chat/${a.id}`}
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
            </div>

            {/* Suporte humano discreto */}
            {SHOW_HUMAN_SUPPORT && (
              <div style={{ marginTop: 8, textAlign: "right" }}>
                <button
                  onClick={() => openWhatsAppEmergency(a)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#9fe5b5",
                    fontSize: 12,
                    opacity: 0.8,
                    textDecoration: "underline",
                    cursor: "pointer",
                  }}
                  title="Use apenas se o chat falhar ou for crítico"
                >
                  ⚠ Suporte humano (WhatsApp)
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
