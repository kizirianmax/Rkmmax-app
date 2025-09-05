// src/pages/PlansScreen.jsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function PlansScreen() {
  const handleCheckout = async (priceId) => {
    const stripe = await stripePromise;

    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });

    const { url } = await res.json();
    window.location.href = url;
  };

  return (
    <div className="container">
      <h1 className="title">💳 Planos de Assinatura</h1>
      <p className="subtitle">Escolha o plano ideal para você:</p>

      <div className="grid">
        {/* Plano Básico EUA */}
        <div className="card">
          <h2>🌎 Básico EUA</h2>
          <p>Acesso inicial ao RKMMAX</p>
          <p className="price">US$ 15,00/mês</p>
          <button
            className="btn"
            onClick={() => handleCheckout("price_1S3RXjENxlkCT0yfDqXQXwQ1")}
          >
            Assinar
          </button>
        </div>

        {/* Plano Intermediário EUA */}
        <div className="card">
          <h2>🌎 Intermediário EUA</h2>
          <p>Mais recursos e suporte</p>
          <p className="price">US$ 25,00/mês</p>
          <button
            className="btn"
            onClick={() => handleCheckout("price_1S3RZGENxlkCT0yfLlOjV8Ns")}
          >
            Assinar
          </button>
        </div>

        {/* Plano Premium EUA */}
        <div className="card">
          <h2>🌎 Premium EUA</h2>
          <p>Tudo incluso, máxima performance</p>
          <p className="price">US$ 40,00/mês</p>
          <button
            className="btn"
            onClick={() => handleCheckout("price_1S3Rb5ENxlkCT0yfrcXLQC0m")}
          >
            Assinar
          </button>
        </div>

        {/* Plano Básico Brasil */}
        <div className="card">
          <h2>🇧🇷 Básico Brasil</h2>
          <p>Acesso inicial ao RKMMAX</p>
          <p className="price">R$ 14,90/mês</p>
          <button
            className="btn"
            onClick={() => handleCheckout("price_1S3RNLENxlkCT0yfu3UlZ7gM")}
          >
            Assinar
          </button>
        </div>

        {/* Plano Intermediário Brasil */}
        <div className="card">
          <h2>🇧🇷 Intermediário Brasil</h2>
          <p>Mais recursos e suporte</p>
          <p className="price">R$ 29,90/mês</p>
          <button
            className="btn"
            onClick={() => handleCheckout("price_1S3RPwENxlkCT0yfGUL2ae8N")}
          >
            Assinar
          </button>
        </div>

        {/* Plano Premium Brasil */}
        <div className="card">
          <h2>🇧🇷 Premium Brasil</h2>
          <p>Tudo incluso, máxima performance</p>
          <p className="price">R$ 49,00/mês</p>
          <button
            className="btn"
            onClick={() => handleCheckout("price_1S3RSCENxlkCT0yf1pE1yLIQ")}
          >
            Assinar
          </button>
        </div>
      </div>
    </div>
  );
}
