// src/pages/Pricing.jsx
import React from "react";

/** Payment Links do Stripe via variáveis de ambiente */
const LINKS = {
  test: {
    basic: "https://buy.stripe.com/test_14AbJ15EXbYz1S5bvn3oA01",
    inter: "https://buy.stripe.com/test_dRmaEX0kD1jVgMZ2YR3oA02",
    prem:  null, // cai no basic
  },
  live: {
    basic: "https://buy.stripe.com/cNi8wPaZh7IjfIVeHz",
    inter: process.env.REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_BR || "",
    prem: process.env.REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_BR || "",
  },
};

const isProd = true; // forçar produção
const getLink = (key) => {
  const env = isProd ? LINKS.live : LINKS.test;
  return env[key] || env.basic || "";
};

const PLANS = [
  { key: "basic", name: "Básico", price: "R$ 25,00/mês",
    description: "Acesso ao Serginho e funções essenciais.",
    features: ["Serginho (orquestrador)", "Limite diário de tokens", "Suporte inicial"],
    link: getLink("basic") },
  { key: "inter", name: "Intermediário", price: "R$ 50,00/mês",
    description: "Mais tokens, voz e recursos avançados.",
    features: ["Tudo do Básico", "Mais tokens/dia", "Whisper + TTS", "Suporte prioritário"],
    link: getLink("inter") },
  { key: "prem", name: "Premium", price: "R$ 90,00/mês",
    description: "Acesso total aos 12 especialistas e recursos premium.",
    features: ["Tudo do Intermediário", "12 especialistas", "GPT-5 + 4.1 Mini", "Suporte 24/7"],
    link: getLink("prem") },
];

const FAQ = [
  {
    q: "Posso usar para estudo?",
    a: "Sim! Acesse o Study Lab (opcional) para estudo acelerado com ABNT/APA, cronogramas e fontes verificadas."
  },
  {
    q: "Há desconto educacional?",
    a: "Sim! Use o código EDU50 no checkout para 50% OFF nos primeiros 6 meses."
  },
  {
    q: "Como funciona o pagamento?",
    a: "Pagamentos processados com segurança pela Stripe. Cancele a qualquer momento."
  },
];

function PlanCard({ plan }) {
  const enabled = Boolean(plan.link);
  return (
    <article style={{border:'1px solid #334155', borderRadius:16, padding:24, marginBottom:24}}>
      <h2 style={{fontWeight:800, fontSize:24}}>{plan.name}</h2>
      <p style={{margin:'6px 0'}}>{plan.price}</p>
      <p style={{margin:'6px 0'}}>{plan.description}</p>
      <ul style={{marginTop:12}}>{plan.features.map((f,i)=><li key={i}>{f}</li>)}</ul>
      <div style={{marginTop:16}}>
        {enabled ? (
          <a href={plan.link} target="_blank" rel="noopener noreferrer"
             style={{display:'inline-block', padding:'10px 16px', fontWeight:800, borderRadius:12, background:'#22d3ee', color:'#000', textDecoration:'none'}}>
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
          marginLeft:'auto', padding:'4px 10px', borderRadius:999, fontWeight:800, border:'1px solid',
          borderColor: isProd ? '#059669' : '#d97706', color: isProd ? '#059669' : '#d97706'
      }}>{isProd ? "PRODUÇÃO" : "TESTE"}</span>
      </div>
      {!isProd && (
        <div style={{marginBottom:16, padding:12, border:'1px solid #d97706', borderRadius:12}}>
          Modo de <strong>teste</strong> ativo.
        </div>
      )}
      {PLANS.map(p => <PlanCard key={p.key} plan={p} />)}
      
      {/* FAQ */}
      <section style={{marginTop:48, maxWidth:720}}>
        <h2 style={{fontSize:28, fontWeight:800, marginBottom:24}}>Perguntas Frequentes</h2>
        {FAQ.map((item, i) => (
          <div key={i} style={{marginBottom:24}}>
            <h3 style={{fontSize:18, fontWeight:700, marginBottom:8}}>{item.q}</h3>
            <p style={{color:'#64748b'}}>{item.a}</p>
          </div>
        ))}
      </section>
      
      <p style={{marginTop:24, color:'#64748b', fontSize:12}}>Pagamentos processados com segurança pela Stripe.</p>
    </main>
  );
}

