// src/pages/PlansScreen.jsx
import React from "react";

const PRICES = {
  BR: {
    simple: { 
      label: "Simples", 
      price: 14.90, 
      currency: "R$", 
      perks: [
        "30 perguntas/dia", 
        "Sem imagens", 
        "12 agentes + Serginho (básico)"
      ] 
    },
    medium: { 
      label: "Médio", 
      price: 24.90, 
      currency: "R$", 
      perks: [
        "100 perguntas/dia", 
        "Até 30 imagens/mês", 
        "Agentes mais inteligentes"
      ] 
    },
    top: { 
      label: "Top", 
      price: 34.99, 
      currency: "R$", 
      perks: [
        "Uso justo (quase ilimitado)", 
        "Até 100 imagens/mês", 
        "Suporte prioritário"
      ] 
    }
  },
  EU: {
    simple: { 
      label: "Simple", 
      price: 9.90, 
      currency: "€", 
      perks: [
        "30 questions/day", 
        "No images", 
        "12 agents + Serginho (basic)"
      ] 
    },
    medium: { 
      label: "Medium", 
      price: 14.99, 
      currency: "€", 
      perks: [
        "100 questions/day", 
        "Up to 30 images/month", 
        "Smarter agents"
      ] 
    },
    top: { 
      label: "Top", 
      price: 19.99, 
      currency: "€", 
      perks: [
        "Fair use (near unlimited)", 
        "Up to 100 images/month", 
        "Priority support"
      ] 
    }
  }
};

function detectRegion() {
  const locale = navigator.language || "en-US";
  return locale.includes("pt-BR") ? "BR" : "EU";
}

export default function PlansScreen() {
  const region = detectRegion();
  const prices = PRICES[region];

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Planos RKMMAX 🚀</h1>
      <p>Região detectada: <b>{region === "BR" ? "Brasil" : "Europa"}</b></p>

      {Object.values(prices).map((plan, i) => (
        <div 
          key={i} 
          style={{
            border: "1px solid #ccc",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "12px",
            background: "#f9f9f9"
          }}
        >
          <h2>{plan.label} — {plan.currency}{plan.price}</h2>
          <ul>
            {plan.perks.map((perk, j) => (
              <li key={j}>{perk}</li>
            ))}
          </ul>
          <button
            style={{
              padding: "10px 16px",
              marginTop: "8px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer"
            }}
          >
            Assinar
          </button>
        </div>
      ))}
    </main>
  );
}
