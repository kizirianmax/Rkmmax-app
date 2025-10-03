// src/pages/Pricing.jsx
import React from "react";

// Ambiente: CRA injeta NODE_ENV no build
const isProd = process.env.NODE_ENV === "production";

/**
 * Payment Links do Stripe
 * - TESTE usa LINKS.test
 * - PRODUÇÃO usa LINKS.live
 */
const LINKS = {
  test: {
    basic: "https://buy.stripe.com/test_14AbJ15EXbYz1S5bvn3oA01",
    inter: "https://buy.stripe.com/test_dRmaEX0kD1jVgMZ2YR3oA02", // <— NOVO (Intermediário)
    prem:  null,                                                // ainda indisponível
  },
  live: {
    basic: "",  // cole aqui quando tiver os links LIVE
    inter: "",
    prem:  "",
  },
};

// sem fallback: só habilita o botão se o plano tiver link próprio
const getLink = (key) => {
  const env = isProd ? LINKS.live : LINKS.test;
  return env[key] || "";
};

const PLANS = [
  {
    key: "basic",
    name: "RKM MAX Básico",
    price: "R$ 14,90/mês",
    description: "Funções essenciais e limite inicial diário.",
    features: ["Essenciais ilimitados", "Limite diário de tokens", "Suporte inicial"],
    link: getLink("basic"),
  },
  {
    key: "inter",
    name: "RKM MAX Intermediário",
    price: "R$ 50,00/mês",
    description: "Funções avançadas, voz (Whisper + TTS) e limites maiores.",
    features: ["Tudo do Básico", "Mais tokens/dia", "Whisper + TTS", "Suporte prioritário"],
    link: getLink("inter"), // agora aponta pro link de teste acima
  },
  {
    key: "prem",
    name: "RKM MAX Premium",
    price: "R$ 90,00/mês",
    description: "Acesso total, priorização máxima e todos os especialistas.",
    features: ["Tudo do Intermediário", "GPT-5 + 4.1 Mini", "12 especialistas + Orquestrador", "Suporte 24/7"],
    link: getLink("prem"), // continua indisponível
  },
];

function PlanCard({ plan }) {
  const enabled = Boolean(plan.link);

  return (
    <article style={{border:'1px solid #334155', borderRadius:16, padding:24, marginBottom:24}}>
      <h2 style={{fontWeight:800, fontSize:24}}>{plan.name}</h2>
      <p style={{margin:'6px 0'}}>{plan.price}</p>
      <p style={{margin:'6px 0'}}>{plan.description}</p>

      <ul style={{marginTop:12}}>
        {plan.features.map((feat, i) => <li key={i}>{feat}</li>)}
      </ul>

      <div style={{marginTop:16}}>
        {enabled ? (
          <a
            href={plan.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{display:'inline-block', padding:'10px 16px', fontWeight:800, borderRadius:12, background:'#22d3ee', color:'#000', textDecoration:'none'}}
          >
            Assinar
          </a>
        ) : (
          <button disabled style={{padding:'10px 16px', fontWeight:800, borderRadius:12, background:'#475569', color:'#cbd5e1'}}>
            Indisponível
          </button>
        )}
      </div>
    </article>
  );
}

export default function Pricing() {
  return (
    <main style={{minHeight:'100vh', padding:'32px'}}>
      <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:24}}>
        <h1 style={{fontSize:36, fontWeight:800}}>Planos RKMMAX</h1>
        <span style={{
          marginLeft:'auto',
          padding:'4px 10px',
          borderRadius:999,
          fontWeight:800,
          border:'1px solid',
          borderColor: isProd ? '#059669' : '#d97706',
          color: isProd ? '#059669' : '#d97706'
        }}>
          {isProd ? "PRODUÇÃO" : "TESTE"}
        </span>
      </div>

      {!isProd && (
        <div style={{marginBottom:16, padding:12, border:'1px solid #d97706', borderRadius:12}}>
          Modo de <strong>teste</strong> ativo.
        </div>
      )}

      {PLANS.map((p) => <PlanCard key={p.key} plan={p} />)}

      <p style={{marginTop:24, color:'#64748b', fontSize:12}}>
        Pagamentos processados com segurança pela Stripe.
      </p>
    </main>
  );
}
