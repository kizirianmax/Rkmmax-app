// src/pages/Agents.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

import usePlan from "../hooks/usePlan";
import AgentCard from "../components/AgentCard";
import { AGENTS } from "../data/agents";

export default function AgentsPage() {
  const navigate = useNavigate();
  const { plan, loading } = usePlan();

  if (loading) {
    return <p style={{ padding: 16 }}>Carregando…</p>;
  }

  const goChat = (agent) => {
    // se estiver bloqueado, manda para planos
    const locked = plan !== "premium" && agent.id !== "serginho";
    if (locked) {
      navigate("/pricing");
      return;
    }
    // ajuste aqui se sua rota de chat for outra
    navigate(`/chat?agent=${agent.id}`);
  };

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Agentes RKMMAX</h1>
      <p style={{ color: "#475569", marginBottom: 24 }}>
        Veja os especialistas disponíveis. Para conversar com eles, assine o plano Premium.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {AGENTS.map((agent) => {
          // regra: somente Serginho fica liberado no plano básico
          const locked = plan !== "premium" && agent.id !== "serginho";

          return (
            <div key={agent.id} style={{ position: "relative" }}>
              <AgentCard agent={agent} onClick={() => goChat(agent)} />

              {locked && (
                <button
                  onClick={() => navigate("/pricing")}
                  style={{
                    position: "absolute",
                    right: 16,
                    top: 36,
                    padding: "10px 16px",
                    background: "#06b6d4",
                    color: "#000",
                    fontWeight: 700,
                    borderRadius: 20,
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Liberar (Premium)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
