// src/pages/PlansScreen.jsx
import React from "react";

// Chama a Function do Netlify que cria a sessão no Stripe
async function handleCheckout(priceKey) {
  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceKey }),
    });

    const data = await res.json();

    if (data?.url) {
      window.location.href = data.url; // redireciona para o Checkout do Stripe
    } else {
      alert("Erro ao iniciar checkout: " + (data?.error || "desconhecido"));
      console.error("Checkout response:", data);
    }
  } catch (err) {
    console.error("Erro no checkout:", err);
    alert("Erro ao processar checkout");
  }
}

export default function PlansScreen() {
  return (
    <div className="plans-wrapper">
      <h1 className="plans-title">Planos RKMMAX</h1>

      {/* ---- BRASIL ---- */}
      <section className="plans-section">
        <h2 className="plans-subtitle">🇧🇷 Brasil (BRL)</h2>

        <div className="cards">
          <div className="card">
            <h3 className="card-title">Básico</h3>
            <p className="card-desc">Acesso inicial ao RKMMAX</p>
            <p className="price">R$ 14,90/mês</p>
            <button
              className="btn"
              onClick={() =>
                handleCheckout("price_1S3RNLENxlkCT0yfu3UlZ7gM")
              }
            >
              Assinar
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">Intermediário</h3>
            <p className="card-desc">Mais recursos e suporte</p>
            <p className="price">R$ 29,90/mês</p>
            <button
              className="btn"
              onClick={() =>
                handleCheckout("price_1S3RPwENxlkCT0yfGUL2ae8N")
              }
            >
              Assinar
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">Premium</h3>
            <p className="card-desc">Tudo incluso, máxima performance</p>
            <p className="price">R$ 39,90/mês</p>
            <button
              className="btn"
              onClick={() =>
                handleCheckout("price_1S3RSCENxlkCT0yf1pE1yLIQ")
              }
            >
              Assinar
            </button>
          </div>
        </div>
      </section>

      {/* ---- EUA ---- */}
      <section className="plans-section">
        <h2 className="plans-subtitle">🌍 EUA (USD)</h2>

        <div className="cards">
          <div className="card">
            <h3 className="card-title">Basic</h3>
            <p className="card-desc">Starter access to RKMMAX</p>
            <p className="price">$ 10.00 / month</p>
            <button
              className="btn"
              onClick={() =>
                handleCheckout("price_1S4XDMENxlkCT0yfyRplY90w")
              }
            >
              Subscribe
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">Intermediate</h3>
            <p className="card-desc">More features and support</p>
            <p className="price">$ 25.00 / month</p>
            <button
              className="btn"
              onClick={() =>
                handleCheckout("price_1S3RZGENxlkCT0yfLlOjV8Ns")
              }
            >
              Subscribe
            </button>
          </div>

          <div className="card">
            <h3 className="card-title">Premium</h3>
            <p className="card-desc">All included, maximum performance</p>
            <p className="price">$ 40.00 / month</p>
            <button
              className="btn"
              onClick={() =>
                handleCheckout("price_1S4XSRENxlkCT0yf17FK5R9Y")
              }
            >
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
