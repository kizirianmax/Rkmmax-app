// src/pages/PlansScreen.jsx
import React from "react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    id: "simple",
    name: "Simples",
    price: "R$14.9",
    perks: ["30 perguntas/dia", "Sem imagens", "12 agentes + Serginho (básico)"],
  },
  {
    id: "medium",
    name: "Médio",
    price: "R$24.9",
    perks: ["100 perguntas/dia", "Até 30 imagens/mês", "Agentes mais inteligentes"],
  },
  {
    id: "top",
    name: "Top",
    price: "R$34.99",
    perks: ["Uso justo (quase ilimitado)", "Até 100 imagens/mês", "Suporte prioritário"],
  },
];

export default function PlansScreen() {
  return (
    <div className="container">
      <h1 className="mb-4">Planos RKMMAX 🚀</h1>
      <p className="mb-4">Região detectada: <strong>Brasil</strong></p>

      <div className="grid gap-4">
        {PLANS.map((plan) => (
          <div key={plan.id} className="card">
            <h2 className="mb-1">
              {plan.name} — {plan.price}
            </h2>
            <ul className="mb-3">
              {plan.perks.map((perk, i) => (
                <li key={i}>{perk}</li>
              ))}
            </ul>
            <Link to={`/subscribe/${plan.id}`} className="btn">
              Assinar
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
