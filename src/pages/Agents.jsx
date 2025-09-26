// src/pages/Agents.jsx
import React from "react";
import usePlan from "../hooks/usePlan";
import AgentCard from "../components/AgentCard";
import { AGENTS } from "../data/agents";

export default function AgentsPage() {
  const { plan, loading } = usePlan();
  const locked = plan !== "premium";

  const handleOpen = (agent) => {
    if (locked) return; // segurança extra
    console.log("Abrir agente:", agent?.id);
  };

  if (loading) {
    return <p style={{ padding: 16 }}>Verificando seu plano…</p>;
  }

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Agentes RKMMAX</h1>

      <p style={{ color: "#475569", marginBottom: 24 }}>
        {locked
          ? "Veja os especialistas disponíveis. Para conversar com eles, assine o plano Premium."
          : "13 agentes conectados — clique para começar."}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16
        }}
      >
        {AGENTS.map((a) => (
          <div key={a.id} style={{ position: "relative" }}>
            <AgentCard agent={a} onClick={() => handleOpen(a)} />
            {locked && (
              <>
                {/* camada para “desabilitar” o card */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient( to bottom, rgba(255,255,255,0.0), rgba(255,255,255,0.6) )",
                    borderRadius: 12
                  }}
                />
                {/* overlay clicável levando para pricing */}
                <a
                  href="/pricing"
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    textDecoration: "none",
                    padding: 12
                  }}
                  aria-label="Liberar especialistas (Premium)"
                >
                  <span
                    style={{
                      background: "#06b6d4",
                      color: "#000",
                      fontWeight: 700,
                      padding: "8px 12px",
                      borderRadius: 12
                    }}
                  >
                    Liberar (Premium)
                  </span>
                </a>
              </>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
