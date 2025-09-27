// src/pages/Agents.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import usePlan from "../hooks/usePlan";
import AgentCard from "../components/AgentCard";
import { AGENTS } from "../data/agents";

export default function AgentsPage() {
  const navigate = useNavigate();
  const { plan, loading } = usePlan();

  if (loading) return <p style={{ padding: 16 }}>Carregando…</p>;

  const goChat = (agent) => navigate(`/chat?agent=${agent.id}`);
  const goPricing = () => navigate("/pricing");

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>Agentes RKMMAX</h1>

      {/* Aviso suave no topo, sem “gritar” premium */}
      <p
        style={{
          color: "#475569",
          marginBottom: 20,
          background: "#f1f5f9",
          padding: "10px 12px",
          borderRadius: 12,
        }}
      >
        Serginho está disponível para todos. Os demais são liberados no plano
        <strong> Premium</strong>.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {AGENTS.map((agent) => {
          const locked = plan !== "premium" && agent.id !== "serginho";

          return (
            <div key={agent.id} style={{ position: "relative" }}>
              {/* Card inteiro continua igual, só muda o clique conforme regra */}
              <AgentCard
                agent={agent}
                onClick={() => (locked ? goPricing() : goChat(agent))}
              />

              {/* Selo discreto no canto direito quando bloqueado */}
              {locked && (
                <div
                  onClick={goPricing}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 14,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: "1px solid #94a3b8",
                    background: "rgba(255,255,255,.8)",
                    backdropFilter: "blur(2px)",
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#0f172a",
                    cursor: "pointer",
                  }}
                  aria-label="Requer plano Premium"
                >
                  Premium
                </div>
              )}

              {/* feedback visual suave em cards bloqueados */}
              {locked && (
                <div
                  onClick={goPricing}
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(241,245,249,.65) 100%)",
                    pointerEvents: "none", // mantém clique no card
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
