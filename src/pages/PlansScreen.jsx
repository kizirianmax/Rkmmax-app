import React from "react";
import "../styles.css";

const PlansScreen = () => {
  return (
    <div className="plans-container">
      <h1 className="plans-title">Escolha seu Plano RKMMax 🚀</h1>
      <p className="plans-subtitle">Região detectada: BR</p>

      {/* Plano Gratuito */}
      <div className="plan-card free">
        <h2>🌿 Gratuito</h2>
        <p className="price">Brasil: R$0/mês</p>
        <ul>
          <li>✔ 10 mensagens/dia (GPT-4.0 mini)</li>
          <li>✔ Ganhe mensagens extras assistindo anúncios</li>
        </ul>
        <button
          className="plan-btn free-btn"
          onClick={() => alert("Plano Gratuito ativado!")}
        >
          Começar grátis
        </button>
      </div>

      {/* Plano Básico */}
      <div className="plan-card basic">
        <h2>🔹 Básico</h2>
        <p className="price">Brasil: R$14,90/mês</p>
        <ul>
          <li>✔ GPT-5 Nano (~275k tokens/dia)</li>
          <li>✔ Acesso a todos os agentes</li>
          <li>✔ Suporte básico</li>
        </ul>
        <button
          className="plan-btn basic-btn"
          onClick={() => handleCheckout("price_basic_BR")}
        >
          Assinar Básico
        </button>
      </div>

      {/* Plano Intermediário */}
      <div className="plan-card intermediate">
        <h2>⚡ Intermediário</h2>
        <p className="price">Brasil: R$29,90/mês</p>
        <ul>
          <li>✔ GPT-4.1 Mini com voz (~410k tokens/dia)</li>
          <li>✔ Todos os agentes liberados</li>
          <li>✔ Bloqueio diário automático</li>
        </ul>
        <button
          className="plan-btn intermediate-btn"
          onClick={() => handleCheckout("price_inter_BR")}
        >
          Assinar Intermediário
        </button>
      </div>

      {/* Plano Premium */}
      <div className="plan-card premium">
        <h2>💎 Premium</h2>
        <p className="price">Brasil: R$90,00/mês</p>
        <ul>
          <li>✔ GPT-5 Standard + GPT-4.1 Mini</li>
          <li>✔ ~710k tokens/mês + ~1.2M tokens/dia</li>
          <li>✔ Todos os agentes liberados</li>
          <li>✔ Suporte prioritário</li>
        </ul>
        <button
          className="plan-btn premium-btn"
          onClick={() => handleCheckout("price_premium_BR")}
        >
          Assinar Premium
        </button>
      </div>
    </div>
  );
};

// ⚠️ Ajuste os IDs dos planos conforme configurados no Stripe
const handleCheckout = async (priceId) => {
  try {
    const res = await fetch("/.netlify/functions/checkout", {
      method: "POST",
      body: JSON.stringify({ priceId }),
    });
    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    alert("Erro ao iniciar checkout. Verifique sua configuração.");
  }
};

export default PlansScreen;
