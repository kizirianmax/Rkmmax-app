import React from "react";

const PLANS = [
  {
    name: "RKMMAX Básico – BR",
    price: "R$ 14,90/mês",
    link: "https://buy.stripe.com/14A00jd7pe6h681Bvn3oA08",
    description: "Funções essenciais, limite inteligente de conversas e suporte inicial."
  },
  {
    name: "RKMMAX Básico – US",
    price: "US$ 10/mês",
    link: "https://buy.stripe.com/00w14naZh0fR1S51UN3oA09",
    description: "Essential functions, smart conversation limits, and starter support."
  },
  {
    name: "RKMMAX Intermediário – BR",
    price: "R$ 50,00/mês",
    link: "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0a",
    description: "Funções avançadas, voz (Whisper + TTS) e maior limite diário de tokens."
  },
  {
    name: "RKMMAX Intermediate – US",
    price: "US$ 20/mês",
    link: "https://buy.stripe.com/5kQ7sL4AtauV9kx2YR3oA0d",
    description: "Advanced features, voice (Whisper + TTS), higher daily token usage."
  },
  {
    name: "RKMMAX Premium – BR",
    price: "R$ 90,00/mês",
    link: "https://buy.stripe.com/00w6oHazhfalcwJcZT30A0c",
    description: "Acesso total: GPT-5 Standard + GPT-4.1 Mini, limites ampliados e prioridade máxima."
  },
  {
    name: "RKMMAX Premium – US",
    price: "US$ 30/mês",
    link: "https://buy.stripe.com/5kQaEXfFx4w71559nf30Ae",
    description: "Full access: GPT-5 Standard + GPT-4.1 Mini, expanded limits and top priority."
  }
];

export default function PricingPage() {
  return (
    <main style={{ maxWidth: 980, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: "#0891b2" }}>
        Planos RKMMAX
      </h1>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16
        }}
      >
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: 16,
              padding: 16,
              boxShadow: "0 1px 2px rgba(0,0,0,.04)",
            }}
          >
            <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>{plan.name}</h2>
            <p style={{ color: "#06b6d4", fontWeight: 700, marginBottom: 8 }}>{plan.price}</p>
            <p style={{ color: "#475569", fontSize: 14, lineHeight: 1.45, marginBottom: 12 }}>
              {plan.description}
            </p>
            <a
              href={plan.link}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                padding: "10px 16px",
                background: "#06b6d4",
                color: "#000",
                borderRadius: 12,
                fontWeight: 700,
                textDecoration: "none",
              }}
            >
              Assinar
            </a>
          </article>
        ))}
      </section>
    </main>
  );
}
