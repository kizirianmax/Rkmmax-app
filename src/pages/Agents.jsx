import React from "react";

/**
 * Página de Agentes — visual premium com destaque em dourado.
 * Toques de glassmorphism, cartões elegantes e botões grandes.
 */

const AGENTS = [
  {
    id: "serginho",
    nome: "Serginho",
    papel: "Orquestrador",
    badge: "Principal",
    desc:
      "Agente especial e generalista. Coordena os 12 especialistas, supervisiona e articula todas as interações.",
    emoji: "🧭",
  },
  {
    id: "emo",
    nome: "Emo",
    papel: "Mentor emocional",
    desc:
      "Apoio psicológico, empatia e motivação para fortalecer sua jornada.",
    emoji: "💙",
  },
  {
    id: "didak",
    nome: "Didak",
    papel: "Instrutor",
    desc:
      "Explica conceitos, ensina conteúdos e facilita o aprendizado em qualquer nível.",
    emoji: "📚",
  },
];

export default function Agents() {
  const goChat = (agentId) => {
    // Se você tiver uma rota de chat, mantenha:
    window.location.href = `/chat?agent=${encodeURIComponent(agentId)}`;
    // Se preferir abrir modal/app nativo depois, é só trocar aqui.
  };

  return (
    <main className="container">
      <header className="page-hero">
        <h1 className="page-title">
          <span className="title-accent">Lista de Agentes</span>
        </h1>
        <p className="page-sub">
          Escolha um especialista e comece a conversar no app.
        </p>
      </header>

      <section className="agents-grid">
        {AGENTS.map((a) => (
          <article key={a.id} className="agent-card">
            <div className="agent-head">
              <div className="agent-avatar" aria-hidden>
                <span className="agent-emoji">{a.emoji}</span>
              </div>
              <div className="agent-meta">
                <div className="agent-line">
                  <h2 className="agent-name">{a.nome}</h2>
                  {a.badge && <span className="agent-badge">{a.badge}</span>}
                </div>
                <div className="agent-role">{a.papel}</div>
              </div>
            </div>

            <p className="agent-desc">{a.desc}</p>

            <button
              className="gold-btn chat-btn"
              onClick={() => goChat(a.id)}
              aria-label={`Abrir chat com ${a.nome}`}
            >
              💬 Chat no app
            </button>

            {/* Link de suporte humano removido do destaque.
                Se você quiser manter (bem discreto), reative o bloco abaixo:
            <div className="support-minor">
              <a href="https://wa.me/55XXXXXXXXXX" target="_blank" rel="noreferrer">
                ⚠ Suporte humano (WhatsApp)
              </a>
            </div>
            */}
          </article>
        ))}
      </section>
    </main>
  );
}
