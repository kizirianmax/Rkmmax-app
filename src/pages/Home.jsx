// src/pages/Home.jsx
import React from "react";
import usePlan from "../hooks/usePlan";

export default function Home() {
  const { plan } = usePlan(); // "free" | "premium"

  return (
    <div className="page-wrap">
      {/* HERO */}
      <header className="hero">
        <h1 className="title-hero">Bem-vindo ao <span className="brand">RKMMAX</span></h1>
        <p className="page-sub">
          Use nossa IA com assinatura segura via Stripe. Comece pelo Serginho
          (grátis) ou destrave os 12 especialistas no plano Premium.
        </p>
      </header>

      {/* GRID DE CARDS */}
      <div className="agents-grid" style={{ marginTop: 12 }}>
        {/* CARD: SERGINHO */}
        <section className="agent-card">
          <div className="agent-top">
            <img className="agent-avatar" src="/avatars/serginho.svg" alt="Serginho" />
            <div>
              <h3 className="agent-name">Serginho</h3>
              <p className="agent-role">Orquestrador</p>
            </div>
          </div>

          <p className="agent-desc">
            Agente especial e generalista. Orquestra os 12 especialistas, supervisiona
            e articula todas as interações para resolver qualquer tarefa.
          </p>

          <a href="/agents" className="btn-chat" style={{ display: "inline-block", textAlign: "center" }}>
            {plan === "premium" ? "Explorar Especialistas" : "Explorar Especialistas (Premium)"}
          </a>
        </section>

        {/* CARD: PLANOS */}
        <section className="agent-card">
          <div className="agent-top">
            <img className="agent-avatar" src="/avatars/planos.svg" alt="Planos" />
            <div>
              <h3 className="agent-name">Planos</h3>
              <p className="agent-role">Assine com segurança</p>
            </div>
          </div>

          <p className="agent-desc">
            Planos claros, pagamento via Stripe e acesso imediato no app. Suporte e
            upgrades simples para crescer junto com você.
          </p>

          <a href="/pricing" className="btn-chat" style={{ display: "inline-block", textAlign: "center" }}>
            Ver planos
          </a>
        </section>
      </div>

      {/* SEÇÃO DE PROVA / BENEFÍCIOS (opcional, leve) */}
      <section className="benefits">
        <div className="pill">SSL/TLS automático</div>
        <div className="pill">Checkout Stripe</div>
        <div className="pill">PWA Android/iOS</div>
        <div className="pill">12 Especialistas + Orquestrador</div>
      </section>
    </div>
  );
}
