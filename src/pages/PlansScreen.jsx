// src/pages/PlansScreen.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

// ==== PRICE IDs (Stripe - PRODUÇÃO) ====
const PRICE_US_BASIC        = "price_1S3RXjENxlkCT0yfDqXQXwQ1";
const PRICE_US_INTERMEDIATE = "price_1S3RZGENxlkCT0yfLlOjV8Ns";
const PRICE_US_PREMIUM      = "price_1S3Rb5ENxlkCT0yfrcXLQC0m";

const PRICE_BR_BASIC        = "price_1S3RNLENxlkCT0yfu3UlZ7gM";
const PRICE_BR_INTERMEDIATE = "price_1S3RPwENxlkCT0yfGUL2ae8N";
const PRICE_BR_PREMIUM      = "price_1S3RSCENxlkCT0yf1pE1yLIQ";

// Catálogo exibido na tela (texto/labels podem ajustar quando quiser)
const PLANS = [
  // USA
  {
    id: "us_basic",
    title: "Basic – USA",
    priceLabel: "US$ 15/mês",
    priceId: PRICE_US_BASIC,
    features: ["Acesso básico", "Suporte padrão"],
  },
  {
    id: "us_intermediate",
    title: "Intermediate – USA",
    priceLabel: "US$ 25/mês",
    priceId: PRICE_US_INTERMEDIATE,
    features: ["Tudo do Basic", "Mais recursos", "Suporte prioritário"],
  },
  {
    id: "us_premium",
    title: "Premium – USA",
    priceLabel: "US$ 40/mês",
    priceId: PRICE_US_PREMIUM,
    features: ["Tudo do Intermediate", "Recursos premium", "Suporte VIP"],
  },
  // Brasil
  {
    id: "br_basic",
    title: "Básico – Brasil",
    priceLabel: "R$ 14,90/mês",
    priceId: PRICE_BR_BASIC,
    features: ["Acesso básico", "Suporte padrão"],
  },
  {
    id: "br_intermediate",
    title: "Intermediário – Brasil",
    priceLabel: "R$ 29,90/mês",
    priceId: PRICE_BR_INTERMEDIATE,
    features: ["Tudo do Básico", "Mais recursos", "Suporte prioritário"],
  },
  {
    id: "br_premium",
    title: "Premium – Brasil",
    priceLabel: "R$ 49,00/mês",
    priceId: PRICE_BR_PREMIUM,
    features: ["Tudo do Intermediário", "Recursos premium", "Suporte VIP"],
  },
];

export default function PlansScreen() {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);
  const [msg, setMsg] = useState("");
  const [email, setEmail] = useState("");

  // Garante usuário logado e captura email para enviar ao Stripe
  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) {
        setMsg("Faça login para assinar um plano.");
        navigate("/login");
      } else {
        setEmail(user.email || "");
      }
    })();
  }, [navigate]);

  async function handleSubscribe(priceId) {
    try {
      setMsg("");
      setLoadingId(priceId);

      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // customer_email ajuda o Stripe a pré-preencher
        body: JSON.stringify({ priceId, customer_email: email, mode: "subscription" }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Erro ao criar sessão de checkout");
      }
      if (data?.url) {
        window.location.href = data.url; // redireciona para o Stripe Checkout
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (err) {
      setMsg(err.message || "Não foi possível iniciar o pagamento.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="container">
      <h1>Escolha seu plano</h1>
      <p className="muted" style={{ marginBottom: 12 }}>
        Conta: <strong>{email || "—"}</strong>
      </p>

      {msg && (
        <div className="error" style={{ marginBottom: 16 }}>
          {msg}
        </div>
      )}

      <div className="grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
        {PLANS.map((plan) => (
          <div key={plan.id} className="card" style={{ background: "#fff", padding: 20, borderRadius: 10, boxShadow: "0 3px 6px rgba(0,0,0,0.1)" }}>
            <h2 className="card-title" style={{ marginBottom: 8 }}>{plan.title}</h2>
            <p className="price" style={{ fontWeight: "bold", marginBottom: 10 }}>{plan.priceLabel}</p>
            <ul className="features" style={{ marginBottom: 12, paddingLeft: 18 }}>
              {plan.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
            <button
              className="button"
              onClick={() => handleSubscribe(plan.priceId)}
              disabled={loadingId === plan.priceId}
            >
              {loadingId === plan.priceId ? "Redirecionando..." : "Assinar"}
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="button" onClick={() => navigate("/")}>← Voltar</button>
      </div>
    </div>
  );
}
