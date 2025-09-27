// src/pages/Home.jsx
import React from "react";
import usePlan from "../hooks/usePlan";

export default function Home() {
  const { plan } = usePlan(); // "free" | "intermediate" | "premium"

  return (
    <div className="page-wrap">
      {/* HERO */}
      <header className="hero">
        <h1 className="title-hero">Bem-vindo ao RKMMAX 🚀</h1>
        <p className="page-sub">
          Use nossa IA com assinatura segura via Stripe.
          Comece pelo Serginho (grátis) ou destrave os 12 especialistas no plano Premium.
        </p>
      </header>

      {/* GRID DE CARDS */}
      <div className="agents-grid" style={{ marginTop: 20 }}>
        {/* Serginho */}
        <section className="agent-card" style={{ position: "relative" }}>
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

          {/* Selo “Livre” para reforçar a disponibilidade em todos os planos */}
          <div
            title="Disponível em todos os planos"
            aria-label="Disponível em todos os planos"
            style={{
              position: "absolute",
              right: 16,
              top: 14,
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #22c55e",
              background: "rgba(34,197,94,.08)",
              backdropFilter: "blur(2px)",
              fontSize: 12,
              fontWeight: 600,
              color: "#15803d",
            }}
          >
            Livre
          </div>

          <a
            href="/agents"
            className="btn-chat"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            {plan === "premium"
              ? "Explorar Especialistas"
              : "Explorar Especialistas (Premium)"}
          </a>
        </section>

        {/* Planos */}
        <section className="agent-card">
          <div className="agent-top">
            <img className="agent-avatar" src="/avatars/emo.svg" alt="Planos" />
            <div>
              <h3 className="agent-name">Planos</h3>
              <p className="agent-role">Assine com segurança</p>
            </div>
          </div>

          <p className="agent-desc">
            Planos claros, pagamento via Stripe e acesso imediato no app.
            Suporte e upgrades simples para crescer junto com você.
          </p>

          <a href="/pricing" className="btn-outline" style={{ display: "inline-block" }}>
            Ver planos
          </a>

          <ul className="feature-list">
            <li>• SSL/TLS automático</li>
            <li>• Checkout Stripe</li>
            <li>• PWA Android/iOS</li>
            <li>• 12 Especialistas + Orquestrador</li>
          </ul>
        </section>
      </div>

      {/* estilos mínimos inline reusáveis */}
      <style>{`
        .page-wrap { max-width:1100px; margin:0 auto; padding:24px 20px 56px; color:#0f172a; line-height:1.45; font-family: system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial; }
        .hero { margin-bottom:28px; }
        .title-hero { font-size:32px; font-weight:800; letter-spacing:-0.02em; margin:0 0 8px; }
        .page-sub { font-size:18px; color:#334155; margin:0; }
        .agents-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; }
        .agent-card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:18px; box-shadow:0 6px 20px rgba(2,6,23,.05); }
        .agent-top { display:flex; gap:12px; align-items:center; margin-bottom:8px; }
        .agent-avatar { width:56px; height:56px; border-radius:12px; }
        .agent-name { font-size:22px; margin:0; }
        .agent-role { margin:2px 0 0; color:#64748b; font-weight:600; font-size:13px; }
        .agent-desc { margin:12px 0 16px; color:#0f172a; }
        .btn-chat { background:linear-gradient(90deg,#2563eb,#7c3aed); color:#fff; padding:12px 16px; border-radius:12px; font-weight:700; }
        .btn-outline { border:1px solid #cbd5e1; padding:10px 14px; border-radius:10px; font-weight:700; color:#0f172a; text-decoration:none; }
        .feature-list { margin:14px 0 0; padding-left:0; list-style:none; color:#334155; }
        @media (min-width:720px){ .title-hero{font-size:40px;} .page-sub{font-size:20px;} }
      `}</style>
    </div>
  );
}
