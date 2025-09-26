import { AGENTS } from "../data/agents";
import AgentCard from "../components/AgentCard";

export default function AgentsPage() {
  const handleOpen = (agent) => {
    // aqui você decide o que acontece ao clicar (abrir chat, etc.)
    console.log("Abrir agente:", agent.id);
  };

  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: "0 16px" }}>
      <h1 style={{ fontSize: 28, marginBottom: 16 }}>Agentes RKMMAX</h1>
      <p style={{ color: "#475569", marginBottom: 24 }}>
        13 agentes conectados — clique para começar.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: 16
        }}
      >
        {AGENTS.map((a) => (
          <AgentCard key={a.id} agent={a} onClick={handleOpen} />
        ))}
      </div>
    </main>
  );
}
