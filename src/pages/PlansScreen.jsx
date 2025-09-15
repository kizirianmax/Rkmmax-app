// src/pages/Subscribe.jsx
import React, { useCallback, useMemo, useState } from "react";

/** IDs de preço por país (Stripe) */
const PRICE_BR = {
  basic:   "price_1S3RNLEMXLkCOyfuU3JL27gmM", // R$14,90
  mid:     "price_1S3RPwENxIkCT0yfGUL2ae8N", // R$29,90
  premium: "price_1S3RSCENxIkCT0yf1pE1yLIQ", // R$49,00
};

const PRICE_US = {
  basic:   "price_1S4XDMENxIkCT0yfyRplY9Ow", // US$10
  mid:     "price_1S3RZGENxIkCT0yf1L0jV8Ns", // US$25
  premium: "price_1S4XSRENxIkCT0yf17FK5R9Y", // US$30
};

/** Detecta região simples pelo idioma do navegador */
function detectRegion() {
  const lang = (navigator.language || "en-US").toLowerCase();
  return lang.startsWith("pt") ? "BR" : "US";
}

export default function Subscribe() {
  const [region, setRegion] = useState(detectRegion());

  const PRICE = useMemo(
    () => (region === "BR" ? PRICE_BR : PRICE_US),
    [region]
  );

  const subscribe = useCallback(async (planKey) => {
    try {
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PRICE[planKey] }),
      });
      const data = await res.json();

      // Se o backend já devolveu URL, redireciona
      if (data?.url) {
        window.location.href = data.url;
        return;
      }

      // Fallback: redirectToCheckout via sessionId
      if (window.Stripe && data?.id) {
        const stripe = window.Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert("Não foi possível iniciar o checkout.");
      }
    } catch (e) {
      alert(e.message || "Erro ao iniciar o checkout.");
    }
  }, [PRICE]);

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h1>Assinar</h1>
      <p>Região detectada: <b>{region}</b></p>

      <div style={{ marginBottom: 12 }}>
        {/* switch BR/US para teste */}
        <button onClick={() => setRegion("BR")} style={{ marginRight: 8 }}>BR</button>
        <button onClick={() => setRegion("US")}>US</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={() => subscribe("basic")}>Assinar Básico</button>
        <button onClick={() => subscribe("mid")}>Assinar Intermediário</button>
        <button onClick={() => subscribe("premium")}>Assinar Premium</button>
      </div>
    </div>
  );
}
