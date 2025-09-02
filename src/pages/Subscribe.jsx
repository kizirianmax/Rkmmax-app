// src/pages/Subscribe.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Mapa local apenas para exibir o resumo do plano na tela.
 * (Os preços reais/IDs são lidos pela função serverless via .env)
 */
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
    perks: ["100 perguntas/dia", "Até 30 imagens/mês", "Agentes mais inteligentes"],
  },
  top: {
    name: "Top",
    price: "R$34.99",
    perks: ["Uso justo (quase ilimitado)", "Até 100 imagens/mês", "Suporte prioritário"],
  },
};

export default function Subscribe() {
  const { planId } = useParams();
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const plan =
    PLAN_DATA[planId] || { name: "Plano", price: "—", perks: [] };

  const handleContinue = async () => {
    try {
      setErrMsg("");
      setLoading(true);

      // Chama a função serverless do Netlify que cria a sessão do Stripe
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Falha ao iniciar checkout (${res.status}): ${txt}`);
      }

      const data = await res.json();

      if (data?.url) {
        // Redireciona para o Checkout seguro do Stripe
        window.location.href = data.url;
      } else {
        throw new Error("Resposta sem URL de checkout.");
      }
    } catch (err) {
      setErrMsg(err.message || "Erro ao iniciar pagamento.");
      setLoading(false);
    }
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
              <li key={i} style={{ marginBottom: 6 }}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {errMsg && (
          <p className="mb-2" style={{ color: "#b91c1c" }}>
            {errMsg}
          </p>
        )}

        <div className="row gap-2">
          <button
            className="btn"
            onClick={handleContinue}
            disabled={loading}
          >
            {loading ? "Redirecionando..." : "Continuar pagamento"}
          </button>

          <Link className="btn btn-outline" to="/plans">
            Voltar aos planos
          </Link>
        </div>
      </div>
    </div>
  );
}
