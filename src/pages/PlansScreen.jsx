import React, { useEffect, useState } from "react";

const ORDER = ["basic", "mid", "premium"];

function normalizePlanKey(lookupKey = "", metadata = {}) {
  // tenta pelo lookup_key: rkm_br_basic, rkm_br_mid, rkm_br_premium…
  const lk = lookupKey.toLowerCase();
  if (lk.includes("basic")) return "basic";
  if (lk.includes("mid") || lk.includes("medium")) return "mid";
  if (lk.includes("premium") || lk.includes("top")) return "premium";
  // fallback: metadata.plan vindo do Stripe (se existir)
  const metaPlan = (metadata.plan || "").toLowerCase();
  if (["basic", "mid", "premium"].includes(metaPlan)) return metaPlan;
  return null;
}

export default function PlansScreen() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/.netlify/functions/prices?region=BR");
        if (!res.ok) throw new Error("Falha ao buscar preços");
        const data = await res.json(); // [{ id, unit_amount, currency, lookup_key, product:{name}, metadata }]
        const mapped = data
          .map((p) => {
            const planKey = normalizePlanKey(p.lookup_key, p.metadata);
            if (!planKey) return null;
            return {
              id: p.id,
              planKey,
              title: p.product?.name || planKey,
              amount: p.unit_amount, // em centavos
              currency: (p.currency || "brl").toUpperCase(),
            };
          })
          .filter(Boolean)
          // mantém sempre na ordem basic -> mid -> premium
          .sort((a, b) => ORDER.indexOf(a.planKey) - ORDER.indexOf(b.planKey));
        setPlans(mapped);
      } catch (e) {
        setErr(e.message || "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function startCheckout(planKey) {
    try {
      const res = await fetch(
        `/.netlify/functions/create-checkout-session?plan=${encodeURIComponent(planKey)}`,
        { method: "POST" }
      );
      if (!res.ok) throw new Error("Erro ao iniciar checkout");
      const json = await res.json();
      if (json?.url) {
        window.location.href = json.url;
      } else {
        throw new Error("Resposta inválida do servidor");
      }
    } catch (e) {
      alert(e.message || "Erro de conexão com o servidor.");
    }
  }

  if (loading) return <div style={{ padding: 16 }}>Carregando planos…</div>;
  if (err) return <div style={{ padding: 16, color: "#f66" }}>Erro: {err}</div>;

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: "0 16px" }}>
      <h2 style={{ color: "#1ee3e8", marginBottom: 16 }}>Planos RKMMAX</h2>
      {plans.map((p) => {
        const priceBRL = p.amount != null ? (p.amount / 100).toLocaleString("pt-BR", {
          style: "currency",
          currency: p.currency || "BRL",
        }) : "—";
        const label =
          p.planKey === "basic" ? "Básico" :
          p.planKey === "mid" ? "Premium (intermediário)" :
          "Premium (top)";
        return (
          <div
            key={p.id}
            style={{
              background: "rgba(255,255,255,0.06)",
              borderRadius: 12,
              padding: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ fontWeight: 700 }}>{label}</div>
            <div style={{ opacity: 0.9, fontSize: 13 }}>{p.title}</div>
            <div style={{ marginTop: 8, fontSize: 18 }}>{priceBRL}/mês</div>
            <button
              onClick={() => startCheckout(p.planKey)}
              style={{
                marginTop: 10,
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                cursor: "pointer",
              }}
            >
              Assinar
            </button>
          </div>
        );
      })}
    </div>
  );
}
