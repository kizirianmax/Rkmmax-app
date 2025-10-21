// src/pages/PlansScreen.jsx
import React, { useMemo, useState } from "react";

/** Detecta região pelo locale do navegador */
function detectRegion() {
  try {
    const loc = (Intl.DateTimeFormat().resolvedOptions().locale || "pt-BR").toLowerCase();
    return loc.includes("pt") || loc.includes("br") ? "BR" : "US";
  } catch {
    return "BR";
  }
}

/** Payment Links via variáveis de ambiente e rótulos por plano/região */
const PLANS = {
  BR: [
    {
      planKey: "basic_br",
      icon: "🔹",
      name: "Básico",
      price: "R$ 25,00/mês",
      features: [
        "Essenciais ilimitados",
        "Acesso ao orquestrador",
        "Suporte básico",
      ],
      payLink: process.env.REACT_APP_STRIPE_PAYMENT_LINK_BASIC_BR || "",
      priceId: null,
      cta: "Assinar Básico",
    },
    {
      planKey: "inter_br",
      icon: "⚡",
      name: "Intermediário",
      price: "R$ 50,00/mês",
      features: [
        "Recursos avançados + voz",
        "Limites diários maiores",
        "Suporte via chat",
      ],
      payLink: process.env.REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_BR || "",
      priceId: null,
      cta: "Assinar Intermediário",
    },
    {
      planKey: "prem_br",
      icon: "💎",
      name: "Premium",
      price: "R$ 90,00/mês",
      features: [
        "GPT-5 Standard + GPT-4.1 Mini",
        "12 especialistas + Orquestrador",
        "Prioridade máxima de suporte",
      ],
      payLink: process.env.REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_BR || "",
      priceId: "price_1S7TM1ENxlkCT0yfGHMGJ9Rh",
      cta: "Assinar Premium",
    },
  ],
  US: [
    {
      planKey: "basic_us",
      icon: "🔹",
      name: "Basic",
      price: "$10/month",
      features: ["Core features", "Orchestrator access", "Basic support"],
      payLink: process.env.REACT_APP_STRIPE_PAYMENT_LINK_BASIC_US || "",
      priceId: null,
      cta: "Subscribe Basic",
    },
    {
      planKey: "inter_us",
      icon: "⚡",
      name: "Intermediate",
      price: "$20/month",
      features: ["Advanced + voice", "Higher daily limits", "Chat support"],
      payLink: process.env.REACT_APP_STRIPE_PAYMENT_LINK_INTERMEDIATE_US || "",
      priceId: null,
      cta: "Subscribe Intermediate",
    },
    {
      planKey: "prem_us",
      icon: "💎",
      name: "Premium",
      price: "$30/month",
      features: ["GPT-5 Std + GPT-4.1 Mini", "All specialists", "Priority support"],
      payLink: process.env.REACT_APP_STRIPE_PAYMENT_LINK_PREMIUM_US || "",
      priceId: null,
      cta: "Subscribe Premium",
    },
  ],
};

export default function PlansScreen() {
  const region = useMemo(detectRegion, []);
  const [loading, setLoading] = useState("");
  const plans = PLANS[region] || PLANS.BR;

  async function startCheckout(plan) {
    try {
      setLoading(plan.planKey);

      // 1) tenta via API da Vercel (se você tiver /api/checkout configurado)
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planKey: plan.planKey,
          region,
          priceId: plan.priceId, // use se seu backend aceitar price_id
        }),
      }).catch(() => null);

      if (res && res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }

      // 2) fallback: Payment Link
      if (plan.payLink) {
        window.location.href = plan.payLink;
        return;
      }

      alert("Link de pagamento ainda não configurado para este plano.");
    } catch (e) {
      console.error(e);
      alert("Não foi possível iniciar o checkout agora.");
    } finally {
      setLoading("");
    }
  }

  return (
    <main className="container" style={{ maxWidth: 980, margin: "40px auto", padding: 16 }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0 }}>Escolha seu Plano</h1>
        <p style={{ opacity: 0.8, margin: "8px 0 0" }}>
          Região detectada: <b>{region}</b>
        </p>
      </header>

      <section
        className="plans-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}
      >
        {plans.map((p) => (
          <article
            key={p.planKey}
            className="card plan-card"
            style={{
              border: "1px solid #e7e7e7",
              borderRadius: 12,
              padding: 16,
              boxShadow: "0 2px 10px rgba(0,0,0,.04)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 24 }} aria-hidden>
                {p.icon}
              </span>
              <h2 style={{ margin: 0 }}>{p.name}</h2>
            </div>

            <div style={{ fontSize: 18, marginTop: 8 }}>{p.price}</div>

            <ul style={{ marginTop: 12, paddingLeft: 18 }}>
              {p.features.map((f, i) => (
                <li key={i}>✔ {f}</li>
              ))}
            </ul>

            <button
              onClick={() => startCheckout(p)}
              disabled={loading === p.planKey}
              aria-busy={loading === p.planKey}
              style={{
                marginTop: 12,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                border: "none",
                background:
                  p.planKey.includes("prem") ? "#6e2cf4" : p.planKey.includes("inter") ? "#4f8cff" : "#2eb88a",
                color: "white",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {loading === p.planKey ? "Redirecionando..." : p.cta}
            </button>
          </article>
        ))}
      </section>

      <footer style={{ marginTop: 24, opacity: 0.8 }}>
        <small>© {new Date().getFullYear()} RKMMax</small>
      </footer>
    </main>
  );
}

