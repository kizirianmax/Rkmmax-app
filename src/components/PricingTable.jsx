// src/components/PricingTable.jsx
import React from "react";

function getRegion() {
  const forced = import.meta.env.VITE_REGION?.toUpperCase();
  if (forced === "BR" || forced === "US") return forced;

  const lang = (navigator.language || "").toLowerCase();
  return lang.startsWith("pt-") ? "BR" : "US";
}

async function startCheckout(priceKey) {
  if (!priceKey) {
    alert("Preço não configurado. Verifique as variáveis no Netlify.");
    return;
  }
  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceKey }),
    });
    const data = await res.json();
    if (data?.url) {
      window.location.href = data.url;
    } else {
      alert("Não foi possível abrir o checkout. Veja os logs da Function.");
    }
  } catch (e) {
    console.error(e);
    alert("Falha ao iniciar o checkout.");
  }
}

export default function PricingTable() {
  const region = getRegion();

  // Labels de preço (UI)
  const priceLabel = {
    BR: {
      free: import.meta.env.VITE_PRICE_LABEL_BR_FREE ?? "R$0",
      basic: import.meta.env.VITE_PRICE_LABEL_BR_BASIC ?? "R$14,90",
      mid: import.meta.env.VITE_PRICE_LABEL_BR_MID ?? "R$24,90",
      premium: import.meta.env.VITE_PRICE_LABEL_BR_PREMIUM ?? "R$39,90",
    },
    US: {
      free: import.meta.env.VITE_PRICE_LABEL_US_FREE ?? "$0",
      basic: import.meta.env.VITE_PRICE_LABEL_US_BASIC ?? "$10",
      mid: import.meta.env.VITE_PRICE_LABEL_US_MID ?? "$15",
      premium: import.meta.env.VITE_PRICE_LABEL_US_PREMIUM ?? "$25",
    },
  };

  // Limites (UI)
  const limits = {
    free: import.meta.env.VITE_LIMIT_FREE ?? "10 mensagens/dia (gpt-4o-mini) + extras por anúncios",
    basic: import.meta.env.VITE_LIMIT_BASIC ?? "20.000 tokens/dia (~13k palavras) — gpt-4o-mini",
    mid: import.meta.env.VITE_LIMIT_MID ?? "30.000 tokens/dia (~20k palavras) — gpt-4o-mini + gpt-4.1-mini",
    premium: import.meta.env.VITE_LIMIT_PREMIUM ?? "40.000 tokens/dia (4o) + 10.000/dia (4.1) + GPT-5",
  };

  // Price IDs do Stripe (checkout)
  const priceIds = {
    BR: {
      basic: import.meta.env.VITE_STRIPE_PRICE_BASIC_BR,
      mid: import.meta.env.VITE_STRIPE_PRICE_MID_BR,
      premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_BR,
    },
    US: {
      basic: import.meta.env.VITE_STRIPE_PRICE_BASIC_US,
      mid: import.meta.env.VITE_STRIPE_PRICE_MID_US,
      premium: import.meta.env.VITE_STRIPE_PRICE_PREMIUM_US,
    },
  };

  const lbl = priceLabel[region];

  return (
    <section className="rkm-pricing">
      <style>{`
        .rkm-pricing { --bg:#0b0f14; --card:#111827; --pill:#1f2937; font-family: Inter, system-ui, sans-serif; padding:40px; background:var(--bg); color:#e5e7eb; }
        .rkm-wrap { max-width:1100px; margin:0 auto; }
        .rkm-head { text-align:center; margin-bottom:32px; }
        .rkm-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(250px,1fr)); gap:20px; }
        .rkm-card { background:var(--card); padding:24px; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.2); display:flex; flex-direction:column; justify-content:space-between; }
        .rkm-title { font-size:20px; margin-bottom:8px; }
        .rkm-desc { font-size:14px; color:#9ca3af; margin-bottom:12px; }
        .rkm-pill { background:var(--pill); display:inline-block; padding:6px 12px; border-radius:20px; font-size:14px; margin-bottom:12px; }
        .rkm-limit { font-size:13px; margin-bottom:16px; color:#d1d5db; }
        .rkm-btn { background:#3b82f6; color:white; padding:10px 16px; border:none; border-radius:8px; cursor:pointer; font-size:14px; font-weight:600; text-align:center; }
        .rkm-btn:hover { filter:brightness(1.1); }
      `}</style>

      <div className="rkm-wrap">
        <div className="rkm-head">
          <h2>Planos RKMMAX</h2>
          <p>Valores e limites vindos das variáveis de ambiente ({region}).</p>
        </div>

        <div className="rkm-grid">
          {/* Free */}
          <article className="rkm-card">
            <div className="rkm-title">Gratuito</div>
            <div className="rkm-pill">{region === "BR" ? `Brasil: ${lbl.free}/mês` : `Exterior: ${lbl.free}/mês`}</div>
            <p className="rkm-limit"><strong>Limite:</strong> {limits.free}</p>
            <button className="rkm-btn" onClick={() => (window.location.href = "/app?plan=free")}>Começar grátis</button>
          </article>

          {/* Basic */}
          <article className="rkm-card">
            <div className="rkm-title">Básico</div>
            <div className="rkm-pill">{region === "BR" ? `Brasil: ${lbl.basic}/mês` : `Exterior: ${lbl.basic}/mês`}</div>
            <p className="rkm-limit"><strong>Limite:</strong> {limits.basic}</p>
            <button className="rkm-btn" onClick={() => startCheckout(priceIds[region].basic)}>Assinar Básico</button>
          </article>

          {/* Mid */}
          <article className="rkm-card">
            <div className="rkm-title">Intermediário</div>
            <div className="rkm-pill">{region === "BR" ? `Brasil: ${lbl.mid}/mês` : `Exterior: ${lbl.mid}/mês`}</div>
            <p className="rkm-limit"><strong>Limite:</strong> {limits.mid}</p>
            <button className="rkm-btn" onClick={() => startCheckout(priceIds[region].mid)}>Assinar Intermediário</button>
          </article>

          {/* Premium */}
          <article className="rkm-card">
            <div className="rkm-title">Premium</div>
            <div className="rkm-pill">{region === "BR" ? `Brasil: ${lbl.premium}/mês` : `Exterior: ${lbl.premium}/mês`}</div>
            <p className="rkm-limit"><strong>Limite:</strong> {limits.premium}</p>
            <button className="rkm-btn" onClick={() => startCheckout(priceIds[region].premium)}>Assinar Premium</button>
          </article>
        </div>
      </div>
    </section>
  );
}
