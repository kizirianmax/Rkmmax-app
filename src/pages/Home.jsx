// src/pages/Home.jsx
import React from "react";
import usePlan from "../hooks/usePlan";
import { AGENTS } from "../data/agents"; // usa a mesma fonte da Agents.jsx

export default function Home() {
  const { plan } = usePlan(); // "free" | "intermediate" | "premium"
  const specialists = (AGENTS || []).filter(a => a.id !== "serginho");

  const goAgents = () => (window.location.href = "/agents");
  const goPricing = () => (window.location.href = "/pricing");

  return (
    <div className="page-wrap">
      {/* HERO */}
      <header className="hero">
        <h1 className="title-hero">Bem-vindo ao RKMMAX 🚀</h1>
        <p className="page-sub">
          Use nossa IA com assinatura segura via Stripe. Comece pelo Serginho (grátis) ou
          destrave os 12 especialistas no plano Premium.
        </p>
      </header>

      {/* GRID: SERGINHO + PLANOS */}
      <div className="cards-grid">
        {/* Serginho */}
        <section className="card" style={{ position: "relative" }}>
          <div className="card-top">
            <img className="avatar" src="/avatars/serginho.svg" alt="Serginho" />
            <div>
              <h3 className="card-title">Serginho</h3>
              <p className="card-sub">Orquestrador</p>
            </div>
          </div>

          <p className="card-desc">
            Agente especial e generalista. Orquestra os 12 especialistas, supervisiona e
            articula todas as interações para resolver qualquer tarefa.
          </p>

          {/* Selo Livre */}
          <div
            title="Disponível em todos os planos"
            aria-label="Disponível em todos os planos"
            className="badge-free"
          >
            Livre
          </div>

          <a href="/agents" className="btn-primary">
            {plan === "premium"
              ? "Explorar Especialistas"
              : "Explorar Especialistas (Premium)"}
          </a>
        </section>

        {/* Planos */}
        <section className="card">
          <div className="card-top">
            <img className="avatar" src="/avatars/emo.svg" alt="Planos" />
            <div>
              <h3 className="card-title">Planos</h3>
              <p className="card-sub">Assine com segurança</p>
            </div>
          </div>

          <p className="card-desc">
            Planos claros, pagamento via Stripe e acesso imediato no app. Suporte e upgrades
            simples para crescer junto com você.
          </p>

          <a href="/pricing" className="btn-outline">Ver planos</a>

          <ul className="features">
            <li>• SSL/TLS automático</li>
            <li>• Checkout Stripe</li>
            <li>• PWA Android/iOS</li>
            <li>• 12 Especialistas + Orquestrador</li>
          </ul>
        </section>
      </div>

      {/* VITRINE DOS 12 ESPECIALISTAS */}
      <section className="gallery-wrap">
        <div className="gallery-head">
          <h2 className="gallery-title">Especialistas (preview)</h2>
          <button className="link-more" onClick={goAgents}>
            Ver todos os 12
          </button>
        </div>

        <div className="gallery">
          {specialists.map((agent) => {
            const icon = agent.icon || `/avatars/${agent.id}.svg`;
            return (
              <button key={agent.id} className="chip" onClick={goAgents} title={agent.name}>
                <img className="chip-icon" src={icon} alt={agent.name} />
                <div className="chip-texts">
                  <span className="chip-name">{agent.name}</span>
                  <span className="chip-badge">Premium</span>
                </div>
              </button>
            );
          })}
        </div>

        {plan !== "premium" && (
          <div className="gallery-cta">
            <button className="btn-primary" onClick={goPricing}>
              Destravar Especialistas (Premium)
            </button>
          </div>
        )}
      </section>

      {/* estilos mínimos */}
      <style>{`
        .page-wrap { max-width:1100px; margin:0 auto; padding:24px 20px 56px; color:#0f172a; line-height:1.45; font-family:system-ui,-apple-system,"Segoe UI",Roboto,Ubuntu,"Helvetica Neue",Arial; }
        .hero { margin-bottom:22px; }
        .title-hero { font-size:32px; font-weight:800; letter-spacing:-.02em; margin:0 0 8px; }
        .page-sub { font-size:18px; color:#334155; margin:0; }
        .cards-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; margin-top:12px; }
        .card { background:#fff; border:1px solid #e2e8f0; border-radius:16px; padding:18px; box-shadow:0 6px 20px rgba(2,6,23,.05); }
        .card-top { display:flex; gap:12px; align-items:center; margin-bottom:8px; }
        .avatar { width:56px; height:56px; border-radius:12px; }
        .card-title { font-size:22px; margin:0; }
        .card-sub { margin:2px 0 0; color:#64748b; font-weight:600; font-size:13px; }
        .card-desc { margin:12px 0 16px; color:#0f172a; }
        .btn-primary { background:linear-gradient(90deg,#2563eb,#7c3aed); color:#fff; padding:12px 16px; border-radius:12px; font-weight:700; border:0; text-decoration:none; display:inline-block; }
        .btn-outline { border:1px solid #cbd5e1; padding:10px 14px; border-radius:10px; font-weight:700; color:#0f172a; text-decoration:none; display:inline-block; }
        .features { margin:14px 0 0; padding:0; list-style:none; color:#334155; }
        .badge-free { position:absolute; right:16px; top:14px; padding:6px 10px; border-radius:999px; border:1px solid #22c55e; background:rgba(34,197,94,.08); backdrop-filter:blur(2px); font-size:12px; font-weight:700; color:#15803d; }

        /* Gallery */
        .gallery-wrap { margin-top:28px; }
        .gallery-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:10px; }
        .gallery-title { font-size:20px; margin:0; }
        .link-more { background:transparent; border:0; color:#2563eb; font-weight:700; cursor:pointer; }
        .gallery { display:flex; gap:12px; overflow-x:auto; padding:6px 2px; }
        .gallery::-webkit-scrollbar { height:8px; }
        .gallery::-webkit-scrollbar-thumb { background:#e2e8f0; border-radius:999px; }
        .chip { min-width:220px; display:flex; gap:10px; align-items:center; border:1px solid #e2e8f0; background:#fff; border-radius:14px; padding:10px; box-shadow:0 4px 14px rgba(2,6,23,.04); cursor:pointer; }
        .chip-icon { width:40px; height:40px; border-radius:10px; }
        .chip-texts { display:flex; gap:8px; align-items:center; }
        .chip-name { font-weight:700; }
        .chip-badge { font-size:12px; font-weight:700; color:#334155; border:1px solid #cbd5e1; padding:4px 8px; border-radius:999px; background:rgba(241,245,249,.65); }
        .gallery-cta { margin-top:14px; text-align:center; }
        @media (min-width:720px){ .title-hero{font-size:40px;} .page-sub{font-size:20px;} }
      `}</style>
    </div>
  );
}
