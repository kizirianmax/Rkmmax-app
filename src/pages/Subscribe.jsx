// src/pages/Subscribe.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const PLAN_DATA = {
  simple: {
    name: "Simples",
    price: "R$14.9",
    perks: [
      "30 perguntas/dia",
      "Sem imagens",
      "12 agentes + Serginho (básico)",
    ],
  },
  medium: {
    name: "Médio",
    price: "R$24.9",
    perks: [
      "100 perguntas/dia",
      "Até 30 imagens/mês",
      "Agentes mais inteligentes",
    ],
  },
  top: {
    name: "Top",
    price: "R$34.99",
    perks: [
      "Uso justo (quase ilimitado)",
      "Até 100 imagens/mês",
      "Suporte prioritário",
    ],
  },
};

export default function Subscribe() {
  const { planId } = useParams();
  const plan =
    PLAN_DATA[planId] || { name: "Plano", price: "—", perks: [] };

  const handleContinue = () => {
    // Aqui depois plugamos o Stripe/Checkout real.
    alert(`Continuar pagamento do plano ${plan.name} (${plan.price})`);
  };

  return (
    <div className="container">
      <div className="card">
        <h1 className="mb-1">Assinar: {plan.name}</h1>
        <p className="mb-3">
          Valor: <strong>{plan.price}</strong> / mês
        </p>

        {plan.perks.length > 0 && (
          <ul className="mb-3">
            {plan.perks.map((item, i) => (
              <li key={i} style={{ marginBottom: 6 }}>{item}</li>
            ))}
          </ul>
        )}

        <div className="row gap-2">
          <button className="btn" onClick={handleContinue}>
            Continuar pagamento
          </button>
          <Link className="btn btn-outline" to="/plans">
            Voltar aos planos
          </Link>
        </div>
      </div>
    </div>
  );
}
