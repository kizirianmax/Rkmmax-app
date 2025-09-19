
const LINKS = {
  BR: {
    basic: "https://buy.stripe.com/fZucN51oH2nZdANfLD3oA0f",   // Básico BR
    inter: "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0a",   // Intermediário BR
    premium: "" // ainda sem link válido
  },
  US: {
    basic: "https://buy.stripe.com/00w14naZh0fR1S51UN3oA09",   // Basic US
    inter: "https://buy.stripe.com/3c14gZebt8MmgMZ2XR3oAg",    // Intermediate US
    premium: "" // ainda sem link válido
  }
};
// src/pages/Plans.jsx
import React, { useState } from "react";

const LINKS = {
  BR: {
    basic:  "https://buy.stripe.com/SEU_LINK_BASIC_BR",        // R$ 14,90/mês
    inter:  "https://buy.stripe.com/SEU_LINK_INTER_BR",        // R$ 29,90/mês
    premium:"https://buy.stripe.com/SEU_LINK_PREMIUM_BR",      // R$ 90,00/mês
  },
  US: {
    basic:   "https://buy.stripe.com/SEU_LINK_BASIC_US",       // US$ 10/mês
    standard:"https://buy.stripe.com/SEU_LINK_STANDARD_US",    // US$ 20/mês (opcional; se não usar, deixe vazio)
    premium: "https://buy.stripe.com/SEU_LINK_PREMIUM_US",     // US$ 30/mês
  }
};

const features = {
  basic: [
    "Acesso básico aos agentes",
    "Limite inteligente de conversas (~200/dia)",
    "Suporte inicial por e-mail",
  ],
  inter: [
    "Todos os agentes liberados",
    "Suporte a voz (Whisper + TTS)",
    "Prioridade no atendimento",
    "Limite maior (~410k tokens/dia)",
  ],
  premium: [
    "Máximo desempenho e precisão",
    "Prioridade máxima no servidor",
    "Todos os recursos + limites expandidos",
  ],
  standardUS: [
    "Acesso ilimitado com smart limit",
    "Agentes extras p/ melhor contexto",
    "Respostas priorizadas",
  ]
};

function PlanCard({ title, price, period, items, link }) {
  const disabled = !link || link.includes("SEU_LINK");
  return (
    <div className="card" style={{padding: 20, textAlign:"center"}}>
      <h3 style={{marginBottom: 6}}>{title}</h3>
      <div className="plan price" style={{marginBottom: 10}}>
        {price} <span style={{fontWeight:400, fontSize:14}}>{period}</span>
      </div>
      <ul style={{textAlign:"left", margin:"0 auto 14px", maxWidth:360, lineHeight:1.5}}>
        {items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
      <a
        className={`btn ${disabled ? "btn-outline" : "btn-primary"}`}
        href={disabled ? undefined : link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => { if (disabled) { e.preventDefault(); alert("Link de pagamento não configurado ainda."); }}}
      >
        Assinar
      </a>
    </div>
  );
}

export default function Plans() {
  const [tab, setTab] = useState("BR"); // "BR" | "US"

  return (
    <section className="container">
      <h1 className="title-hero">Planos</h1>
      <p className="page-sub">Escolha a moeda e assine com segurança via Stripe.</p>

      {/* Tabs */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, maxWidth:420, margin:"16px auto"}}>
        <button
          className={`btn ${tab==="BR" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("BR")}
        >
          🇧🇷 Reais (BRL)
        </button>
        <button
          className={`btn ${tab==="US" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setTab("US")}
        >
          🇺🇸 Dollars (USD)
        </button>
      </div>

      {/* Grid de cards */}
      {tab === "BR" ? (
        <div className="grid grid-3" style={{marginTop:16}}>
          <PlanCard
            title="Básico BR"
            price="R$ 14,90"
            period="/mês"
            items={features.basic}
            link={LINKS.BR.basic}
          />
          <PlanCard
            title="Intermediário BR"
            price="R$ 29,90"
            period="/mês"
            items={features.inter}
            link={LINKS.BR.inter}
          />
          <PlanCard
            title="Premium BR"
            price="R$ 90,00"
            period="/mês"
            items={features.premium}
            link={LINKS.BR.premium}
          />
        </div>
      ) : (
        <div className="grid grid-3" style={{marginTop:16}}>
          <PlanCard
            title="Basic US"
            price="US$ 10"
            period="/month"
            items={features.basic}
            link={LINKS.US.basic}
          />
          <PlanCard
            title="Standard US"
            price="US$ 20"
            period="/month"
            items={features.standardUS}
            link={LINKS.US.standard}
          />
          <PlanCard
            title="Premium US"
            price="US$ 30"
            period="/month"
            items={features.premium}
            link={LINKS.US.premium}
          />
        </div>
      )}

      <p className="page-sub" style={{marginTop:18}}>
        Após o pagamento, o acesso é liberado imediatamente no app.
      </p>
    </section>
  );
}
