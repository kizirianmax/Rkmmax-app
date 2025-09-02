  // src/pages/Subscribe.jsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

/**
 * Mapa local apenas para exibir o resumo do plano escolhido.
 * (Os preços reais/IDs são lidos pela função serverless no Netlify.)
 */
const PLAN_DATA = {
  simple: {
    name: "Simples",
    price: "R$14.9",
    perks: ["30 perguntas/dia", "Sem imagens", "12 agentes + Serginho (básico)"],
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
  const plan =
    PLAN_DATA[planId] || { name: "Plano", price: "—", perks: [] };

  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  /**
   * Chama a função serverless do Netlify que cria a Checkout Session
   * e redireciona o usuário para a página segura do Stripe.
   */
  const handleContinue = async () => {
    try {
      setErrMsg("");
      setLoading(true);

      const res = await fetch(
        "/.netlify/functions/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planId }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Falha ao iniciar pagamento.");
      }

      // A função retorna { id, url }. Redirecionar para o Stripe:
      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("URL de checkout não recebida.");
      }
    } catch (err) {
      console.error(err);
      setErrMsg(err.message || "Erro inesperado. Tente novamente.");
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 720, margin: "0 auto", padding: 16 }}>
      <div className="card" style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 16 }}>
        <h1 className="mb-1" style={{ marginBottom: 8 }}>
          Assinar: {plan.name}
        </h1>
        <p className="mb-3" style={{ marginBottom: 12 }}>
          Valor: <strong>{plan.price}</strong> / mês
        </p>

        {plan.perks.length > 0 && (
          <ul className="mb-3" style={{ marginBottom: 12 }}>
            {plan.perks.map((item, i) => (
              <li key={i} style={{ marginBottom: 6 }}>
                {item}
              </li>
            ))}
          </ul>
        )}

        {errMsg && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              borderRadius: 8,
              padding: "8px 12px",
              marginBottom: 12,
            }}
          >
            {errMsg}
          </div>
        )}

        <div className="row gap-2" style={{ display: "flex", gap: 12 }}>
          <button
            className="btn"
            onClick={handleContinue}
            disabled={loading}
            style={{
              background: "#2563eb",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 16px",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Redirecionando…" : "Continuar pagamento"}
          </button>

          <Link
            className="btn btn-outline"
            to="/plans"
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 8,
              padding: "10px 16px",
              textDecoration: "none",
              color: "#111827",
              background: "#fff",
            }}
          >
            Voltar aos planos
          </Link>
        </div>
      </div>
    </div>
  );
}
