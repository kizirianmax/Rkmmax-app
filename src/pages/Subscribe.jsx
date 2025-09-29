// src/pages/Subscribe.jsx
import React, { useCallback, useMemo, useState } from "react";

// Seus IDs de preço (Stripe) por país:
const PRICE_BR = {
  basic: "price_1S3RNL...gmM",        // R$ 14,90
  intermediate: "price_1S3RPw...ae8N", // R$ 50,00
  premium: "price_1S3RSC...yLIQ",     // R$ 90,00
};
const PRICE_US = {
  basic: "price_1S4XDM...y9Ow",        // US$ 10,00
  intermediate: "price_1S3RZG...V8Ns", // US$ 25,00
  premium: "price_1S4XSRE...5R9Y",     // US$ 30,00
};

// Detecta a região usando o idioma do navegador
function detectRegion() {
  const lang = (navigator.language || "en-US").toLowerCase();
  return lang.startsWith("pt") ? "BR" : "US";
}

export default function Subscribe() {
  const [region, setRegion] = useState(detectRegion());

  // Seleciona o conjunto de preços com base na região
  const PRICE = useMemo(
    () => (region === "BR" ? PRICE_BR : PRICE_US),
    [region]
  );

  // Função que cria a sessão de checkout via Netlify Function e redireciona para o Stripe
  const subscribe = useCallback(
    async (planKey) => {
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: PRICE[planKey] }),
      });
      const data = await res.json();

      // Se o backend retornar uma URL, redireciona direto
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      // Se não, usa redirectToCheckout com sessionId
      if (window.Stripe && data?.id) {
        const stripe = window.Stripe(
          import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
        );
        await stripe.redirectToCheckout({ sessionId: data.id });
      } else {
        alert("Não foi possível iniciar o checkout.");
      }
    },
    [PRICE]
  );

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h1>Assinar</h1>
      <p>
        Região detectada: <b>{region}</b>
      </p>
      {/* Botões manuais para alternar BR/US (apenas para testes) */}
      <button
        onClick={() => setRegion("BR")}
        style={{ marginRight: 8 }}
      >
        BR
      </button>
      <button onClick={() => setRegion("US")}>US</button>

      {/* Botões de assinatura por plano */}
      <div style={{ display: "grid", gap: 10, marginTop: 12 }}>
        <button onClick={() => subscribe("basic")}>Assinar Básico</button>
        <button onClick={() => subscribe("intermediate")}>
          Assinar Intermediário
        </button>
        <button onClick={() => subscribe("premium")}>Assinar Premium</button>
      </div>
    </div>
  );
}
