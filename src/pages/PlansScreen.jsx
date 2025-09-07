// src/pages/PlansScreen.jsx
import React, { useState } from "react";

const PLANS = [
  {
    id: "br-basic",
    title: "Básico",
    desc: "Acesso inicial ao RKMMAX",
    priceLabel: "R$ 14,90/mês",
    currency: "BRL",
    priceKey: "price_XXXX_brl_basic", // <<< SEU price do Stripe
  },
  {
    id: "br-premium",
    title: "Premium",
    desc: "Tudo incluso, máxima performance",
    priceLabel: "R$ 39,90/mês",
    currency: "BRL",
    priceKey: "price_XXXX_brl_premium", // <<< SEU price do Stripe
  },
];

export default function PlansScreen() {
  const [loadingId, setLoadingId] = useState(null);

  const startCheckout = async (priceKey) => {
    setLoadingId(priceKey);
    try {
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey }),
      });

      let data = {};
      try {
        data = await res.json();
      } catch {
        throw new Error("Resposta inválida do servidor");
      }

      if (!res.ok) {
        const msg = data?.details || data?.error || res.statusText || "desconhecido";
        throw new Error(msg);
      }

      if (data?.url) {
        window.location.href = data.url; // redireciona pro Checkout
        return;
      }

      throw new Error("Não veio URL do checkout");
    } catch (err) {
      alert(`Erro ao iniciar checkout: ${err?.message || err || "desconhecido"}`);
      console.error("Checkout start error:", err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.h1}>Planos RKMMAX</h1>

      <div style={styles.grid}>
        {PLANS.map((p) => (
          <div key={p.id} style={styles.card}>
            <div style={styles.flag}>
              {p.currency === "BRL" ? "🇧🇷 Brasil (BRL)" : "🌎"}
            </div>
            <h2 style={styles.title}>{p.title}</h2>
            <p style={styles.desc}>{p.desc}</p>
            <p style={styles.price}>{p.priceLabel}</p>

            <button
              onClick={() => startCheckout(p.priceKey)}
              disabled={loadingId === p.priceKey}
              style={{ ...styles.btn, opacity: loadingId === p.priceKey ? 0.7 : 1 }}
            >
              {loadingId === p.priceKey ? "Iniciando…" : "Assinar"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#0f172a", color: "#e2e8f0", padding: 32 },
  h1: { textAlign: "center", marginBottom: 24, fontSize: 32, color: "#7dd3fc" },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 16,
    maxWidth: 1000,
    margin: "0 auto",
  },
  card: {
    background: "#0b1220",
    border: "1px solid #1f2a44",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 6px 20px rgba(0,0,0,.25)",
  },
  flag: { fontSize: 14, opacity: 0.8, marginBottom: 6 },
  title: { fontSize: 22, margin: "6px 0 4px" },
  desc: { fontSize: 14, opacity: 0.9, minHeight: 40 },
  price: { fontSize: 18, margin: "8px 0 18px", color: "#a5b4fc" },
  btn: {
    width: "100%",
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
    color: "white",
    fontWeight: 700,
  },
};
