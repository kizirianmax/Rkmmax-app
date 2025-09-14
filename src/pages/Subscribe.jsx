// src/components/Subscribe.jsx
import React, { useMemo } from "react";

function detectRegion() {
  try {
    const lang = (navigator.language || "en").toLowerCase();
    if (lang.startsWith("pt")) return "BR";
  } catch {}
  return "US";
}

export default function Subscribe() {
  const region = useMemo(() => detectRegion(), []);
  const priceMap = useMemo(() => {
    if (region === "US") {
      return {
        basic:   "price_1S4XDMENxIkCT0yfyrplY90w",
        pro:     "price_1S3RZGENxIkCT0yf1L0jV8Ns",
        premium: "price_1S4XSRENxIkCT0yf17FK5R9Y",
      };
    }
    return {
      basic:   "price_1S3RNLEMXLkCOyfU3JL27gmM",
      pro:     "price_1S3RPwENxIkCT0yfGUL2ae8N",
      premium: "price_1S3RSCENxIkCT0yf1pE1yLIQ",
    };
  }, [region]);

  async function subscribe(planKey) {
    const res = await fetch("/.netlify/functions/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId: priceMap[planKey] }),
    });
    const data = await res.json();

    // 1) Se a função já trouxe URL de sessão, redireciona direto
    if (data?.url) {
      window.location.href = data.url;
      return;
    }

    // 2) Fallback: usar Stripe.js (caso você queira/precise)
    if (window.Stripe && import.meta?.env?.VITE_STRIPE_PUBLISHABLE_KEY) {
      const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      await stripe.redirectToCheckout({ sessionId: data.id });
    }
  }

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <small>Região detectada: {region}</small>
      <button onClick={() => subscribe("basic")}>
        {region === "US" ? "Assinar Basic (US$10)" : "Assinar Básico (R$14,90)"}
      </button>
      <button onClick={() => subscribe("pro")}>
        {region === "US" ? "Assinar Intermediate (US$25)" : "Assinar Intermediário (R$29,90)"}
      </button>
      <button onClick={() => subscribe("premium")}>
        {region === "US" ? "Assinar Premium (US$30)" : "Assinar Premium (R$49,00)"}
      </button>
    </div>
  );
}
