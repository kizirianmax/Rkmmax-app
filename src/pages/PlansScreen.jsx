// src/pages/PlansScreen.jsx
import React, { useState } from "react";

export default function PlansScreen() {
  const [loading, setLoading] = useState(false);

  // Função para criar sessão de checkout
  const handleSubscribe = async (priceId) => {
    try {
      setLoading(true);

      const response = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId, 
          email: "teste@usuario.com", // depois vamos substituir pelo email real do usuário logado
        }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url; // redireciona para o Stripe Checkout
      } else {
        alert("Erro ao criar sessão de pagamento");
        console.error("Stripe error:", data);
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Não foi possível iniciar o checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="plans-container">
      <h1>Escolha seu Plano</h1>

      <div className="plan-card">
        <h2>Plano Básico</h2>
        <p>Ideal para começar.</p>
        <strong>R$5,00 / mês</strong>
        <button 
          disabled={loading}
          onClick={() => handleSubscribe("price_xxxxxx")}
        >
          {loading ? "Carregando..." : "Assinar Plano Básico"}
        </button>
      </div>

      <div className="plan-card">
        <h2>Plano Premium</h2>
        <p>Recursos avançados e prioridade.</p>
        <strong>R$15,00 / mês</strong>
        <button 
          disabled={loading}
          onClick={() => handleSubscribe("price_yyyyyy")}
        >
          {loading ? "Carregando..." : "Assinar Plano Premium"}
        </button>
      </div>
    </div>
  );
}
