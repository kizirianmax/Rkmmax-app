// src/pages/Plans.jsx
import React, { useState } from "react";
import "../index.css";

// 🔗 COLE AQUI os Payment Links do Stripe (um link por plano)
const LINKS = {
  BRL: {
    basic:   "https://buy.stripe.com/SEU_LINK_BRL_BASICO",
    pro:     "https://buy.stripe.com/SEU_LINK_BRL_INTERMEDIARIO",
    premium: "https://buy.stripe.com/SEU_LINK_BRL_PREMIUM",
  },
  USD: {
    basic:   "https://buy.stripe.com/SEU_LINK_USD_BASIC",
    pro:     "https://buy.stripe.com/SEU_LINK_USD_INTERMEDIATE",
    premium: "https://buy.stripe.com/SEU_LINK_USD_PREMIUM",
  },
};

// Valores oficiais
const PLANS = {
  BRL: [
    {
      id: "basic",
      name: "Básico",
      price: "R$ 14,90",
      period: "/mês",
      features: [
        "Funções essenciais",
        "Limite inteligente de conversas",
        "Suporte inicial",
      ],
    },
    {
      id: "pro",
      name: "Intermediário",
      price: "R$ 29,90",
      period: "/mês",
      highlight: true,
      features: [
        "Equilíbrio custo ↔ performance",
        "Suporte a voz (Whisper + TTS)",
        "Agentes liberados + prioridade",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "R$ 90,00",
      period: "/mês",
      features: [
        "Acesso ilimitado aos agentes",
        "GPT-5 Standard + GPT-4.1 Mini",
        "Prioridade e limites expandidos",
      ],
    },
  ],
  USD: [
    {
      id: "basic",
      name: "Basic",
      price: "US$ 10",
      period: "/mo",
      features: [
        "Essential features",
        "Smart conversation limit",
        "Starter support",
      ],
    },
    {
      id: "pro",
      name: "Intermediate",
      price: "US$ 20",
      period: "/mo",
      highlight: true,
      features: [
        "Great cost/performance",
        "Voice (Whisper + TTS)",
        "All agents + priority support",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "US$ 30",
      period: "/mo",
      features: [
        "Unlimited agent access",
        "GPT-5 Standard + GPT-4.1 Mini",
        "Priority support & higher limits",
      ],
    },
  ],
};

export default function Plans() {
  const [currency, setCurrency] = useState("BRL");
  const plans = PLANS[currency];

  return (
    <main className="container">
      <section className="section">
        <h1 className="title-hero center">Planos</h1>

        {/* Toggle BRL / USD */}
        <div className="center" style={{ margin: "16px 0 28px" }}>
          <div
            className="card"
            style={{
              display: "inline-flex",
              gap: 8,
              padding: "6px",
              borderRadius: 999,
              alignItems: "center",
            }}
            role="tablist"
            aria-label="Selecionar moeda"
          >
            <button
              role="tab"
              aria-selected={currency === "BRL"}
              className={`btn ${currency === "BRL" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setCurrency("BRL")}
              style={{ borderRadius: 999, padding: "8px 16px" }}
            >
              BRL (R$)
            </button>
            <button
              role="tab"
              aria-selected={currency === "USD"}
              className={`btn ${currency === "USD" ? "btn-primary" : "btn-outline"}`}
              onClick={() => setCurrency("USD")}
              style={{ borderRadius: 999, padding: "8px 16px" }}
            >
              USD ($)
            </button>
          </div>
        </div>

        {/* Cards */}
        <div className="pricing grid-3">
          {plans.map((p) => (
            <article
              key={p.id}
              className="plan card"
              aria-label={`Plano ${p.name}`}
              style={{
                borderColor: p.highlight ? "rgba(33,199,255,.45)" : undefined,
                boxShadow: p.highlight ? "0 12px 40px rgba(2,167,223,.22)" : undefined,
                transform: p.highlight ? "translateY(-2px)" : undefined,
              }}
            >
              <header style={{ marginBottom: 12 }}>
                <h2 className="price" style={{ marginBottom: 4 }}>{p.name}</h2>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "0.2px" }}>
                  {p.price} <span style={{ opacity: 0.7 }}>{p.period}</span>
                </div>
              </header>

              <ul style={{ textAlign: "left", margin: "14px 0 18px", paddingLeft: 18 }}>
                {p.features.map((f, i) => (
                  <li key={i} style={{ marginBottom: 8 }}>• {f}</li>
                ))}
                <li style={{ marginTop: 6, opacity: 0.8, fontSize: 13 }}>
                  Garantia de 7 dias
                </li>
              </ul>

              <a
                className="btn btn-primary"
                href={LINKS[currency][p.id]}
                target="_blank"
                rel="noopener noreferrer"
                style={{ width: "100%", textAlign: "center" }}
              >
                Assinar {currency === "BRL" ? "agora" : "now"}
              </a>
            </article>
          ))}
        </div>

        <p className="center" style={{ marginTop: 18, opacity: 0.85 }}>
          Cobrança recorrente mensal. Você pode cancelar quando quiser.
        </p>
      </section>
    </main>
  );
}
