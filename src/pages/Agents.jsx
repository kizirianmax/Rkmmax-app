import React from "react";
import AGENTS from "../data/agents"; // <- default export (sem chaves)

export default function AgentsPage() {
  return (
    <main style={{ padding: "28px 16px 56px" }}>
      <section className="card-xl">
        <header className="card-xl__header">
          <h1 className="title-hero">Lista de Agentes</h1>
          <p className="subtitle">
            Escolha um especialista e comece a conversar no app.
          </p>
        </header>

        <div className="agents-grid">
          {AGENTS.map((a) => (
            <article className="agent-card" key={a.id}>
              <div className="agent-card__top">
                <img
                  className="agent-avatar"
                  src={a.avatar_url || "/avatars/default.png"}
                  alt={`Avatar de ${a.name}`}
                  loading="lazy"
                  width={72}
                  height={72}
                />
                <div className="agent-id">
                  <div className="agent-name">
                    {a.name}
                    {a.principal && <span className="badge-primary">Principal</span>}
                  </div>
                  <div className="agent-role">{a.role}</div>
                </div>
              </div>

              <p className="agent-desc">{a.description}</p>

              <div className="agent-actions">
                {/* se você já tem rota/ação, troque o onClick abaixo */}
                <button
                  className="btn-gold"
                  onClick={() => window.alert(`Abrir chat com ${a.name} (em breve)`)}
                >
                  💬 Chat no app
                </button>
                {/* opcional: link secundário (ex.: WhatsApp de emergência) 
                <a className="link-ghost" href="https://wa.me/..." target="_blank" rel="noreferrer">
                  Suporte humano
                </a> 
                */}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
