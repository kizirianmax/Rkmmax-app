// src/pages/Agents.jsx
import React from "react";
import PlanGate from "../components/PlanGate";
import AgentCard from "../components/AgentCard";
import { AGENTS } from "../data/agents";

export default function AgentsPage() {
  // Diagnóstico básico no console
  console.log("[/agents] AGENTS tipo:", typeof AGENTS, "len:", Array.isArray(AGENTS) ? AGENTS.length : "n/a");
  console.log("[/agents] AgentCard:", typeof AgentCard);

  const handleOpen = (agent) => {
    console.log("Abrir agente:", agent?.id, agent);
  };

  // Mensagens úteis se algo estiver fora do lugar
  const problems = [];
  if (!Array.isArray(AGENTS)) problems.push("AGENTS não é um array (verifique o import e o caminho ../data/agents).");
  if (typeof AgentCard !== "function") problems.push("AgentCard não é um componente (verifique o import ../components/AgentCard).");

  return (
    <PlanGate requirePlan="premium">
      <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
        <h1 style={{ fontSize: 28, marginBottom: 16 }}>Agentes RKMMAX</h1>
        <p style={{ color: "#475569", marginBottom: 24 }}>
          13 agentes conectados — clique para começar.
        </p>

        {/* Se houver problema de import, mostramos na tela em vez de quebrar a página */}
        {problems.length > 0 ? (
          <div style={{ background: "#fee2e2", border: "1px solid #ef4444", color: "#991b1b", padding: 12, borderRadius: 8 }}>
            <strong>Diagnóstico /agents:</strong>
            <ul style={{ marginTop: 8 }}>
              {problems.map((p, i) => <li key={i}>{p}</li>)}
            </ul>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16
            }}
          >
            {(AGENTS || []).map((a) => (
              <AgentCard key={a.id} agent={a} onClick={handleOpen} />
            ))}
          </div>
        )}
      </main>
    </PlanGate>
  );
}
