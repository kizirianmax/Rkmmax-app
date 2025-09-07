// src/pages/PlansScreen.jsx
import React from "react";
import { loadStripe } from "@stripe/stripe-js";

// Pode não existir em produção ainda; só inicializa se houver
const PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = PK ? loadStripe(PK) : null;

export default function PlansScreen() {
  // Função chamada ao clicar em "Assinar"
  async function assinar(priceEnvKey) {
    try {
      const priceKey = import.meta.env[priceEnvKey]; // lê a env do Netlify

      if (!priceKey) {
        alert(`Preço não configurado: ${priceEnvKey}`);
        return;
      }

      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao criar sessão");

      // preferimos a URL vinda do backend
      if (data.url) {
        window.location.href = data.url;
        return;
      }

      // fallback via Stripe.js caso o backend retorne sessionId
      if (stripePromise && data.id) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.id });
        return;
      }

      alert("Não foi possível redirecionar para o checkout.");
    } catch (e) {
      console.error(e);
      alert("Erro ao iniciar pagamento: " + e.message);
    }
  }

  // --- UI (mantém a estrutura de cartões e botões "Assinar") ---
  return (
    <div className="plans-wrapper">
      {/* BRASIL */}
      <section>
        <div className="card">
          <h2>🇧🇷 Básico Brasil</h2>
          <p>Acesso inicial ao RKMMAX</p>
          <p className="price">R$ 14,90/mês</p>
          <button className="btn"
            onClick={() => assinar("STRIPE_PRICE_SIMPLE_BR")}>
            Assinar
          </button>
        </div>

        <div className="card">
          <h2>🇧🇷 Intermediário Brasil</h2>
          <p>Mais recursos e suporte</p>
          <p className="price">R$ 29,90/mês</p>
          <button className="btn"
            onClick={() => assinar("STRIPE_PRICE_MEDIUM_BR")}>
            Assinar
          </button>
        </div>

        <div className="card">
          <h2>🇧🇷 Premium Brasil</h2>
          <p>Tudo incluso, máxima performance</p>
          <p className="price">R$ 49,00/mês</p>
          <button className="btn"
            onClick={() => assinar("STRIPE_PRICE_TOP_BR")}>
            Assinar
          </button>
        </div>
      </section>

      {/* EUA */}
      <section>
        <div className="card">
          <h2>🌍 Básico EUA</h2>
          <p>Acesso inicial ao RKMMAX</p>
          <p className="price">US$ 15,00/mês</p>
          <button className="btn"
            onClick={() => assinar("STRIPE_PRICE_SIMPLE_US")}>
            Assinar
          </button>
        </div>

        <div className="card">
          <h2>🌍 Intermediário EUA</h2>
          <p>Mais recursos e suporte</p>
          <p className="price">US$ 25,00/mês</p>
          <button className="btn"
            onClick={() => assinar("STRIPE_PRICE_MEDIUM_US")}>
            Assinar
          </button>
        </div>

        <div className="card">
          <h2>🌍 Premium EUA</h2>
          <p>Tudo incluso, máxima performance</p>
          <p className="price">US$ 40,00/mês</p>
          <button className="btn"
            onClick={() => assinar("STRIPE_PRICE_TOP_US")}>
            Assinar
          </button>
        </div>
      </section>
    </div>
  );
}
