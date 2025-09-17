import React from "react";
import { AGENTS } from "../data/agents";

export default function Agents() {
  return (
    <>
      <h1 className="title-hero">Lista de Agentes</h1>
      <p className="page-sub">Escolha um especialista e comece a conversar no app.</p>

      <div className="agents-grid">
        {AGENTS.map(a => (
          <article key={a.id} className="agent-card">
            <div className="agent-top">
              <img className="agent-avatar" src={a.avatar_url} alt={`Avatar de ${a.name}`} />
              <div>
                <h3 className="agent-name">
                  {a.name}{" "}
                  {a.principal && <span className="badge">PRINCIPAL</span>}
                </h3>
                <p className="agent-role">{a.role}</p>
              </div>
            </div>

            <p className="agent-desc">{a.description}</p>

            <button className="btn-chat" onClick={() => alert(`Abrir chat com ${a.name} (em breve)`)} >
              💬 Chat no app
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
