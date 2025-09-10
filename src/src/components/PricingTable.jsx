// src/components/PricingTable.jsx
import React from "react";

function getRegion() {
  const forced = import.meta.env.VITE_REGION?.toUpperCase?.();
  if (forced === "BR" || forced === "US") return forced;
  // auto: pt-BR -> BR, senão US
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
    if (data?.url) window.location.href = data.url;
    else alert("Não foi possível abrir o checkout. Veja os logs da Function.");
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
    free:
      import.meta.env.VITE_LIMIT_FREE ??
      "10 mensagens/dia (gpt-4o-mini) + extras por anúncios (vídeo +5, banner +3, quiz +10)",
    basic:
      import.meta.env.VITE_LIMIT_BASIC ??
      "20.000 tokens/dia (~13k palavras) — gpt-4o-mini",
    mid:
      import.meta.env.VITE_LIMIT_MID ??
      "30.000 tokens/dia (~20k palavras) — gpt-4o-mini + gpt-4.1-mini",
    premium:
      import.meta.env.VITE_LIMIT_PREMIUM ??
      "40.000 tokens/dia (4o) + 10.000/dia (4.1) + 20 chamadas/mês (GPT-5)",
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
        .rkm-pricing{--bg:#0b0f14;--card:#111827;--muted:#9aa4b2;--txt:#e5eef7;--acc:#7c3aed;--ok:#10b981;--line:#1f2937;--chip:#1f2230}
        .rkm-pricing{font-family:Inter,system-ui,Segoe UI,Roboto,Arial,sans-serif;background:var(--bg);color:var(--txt);padding:48px 16px}
        .rkm-wrap{max-width:1100px;margin:0 auto}
        .rkm-head{text-align:center;margin-bottom:28px}
        .rkm-head h2{font-size:32px;margin:0 0 8px}
        .rkm-head p{color:var(--muted);margin:0}
        .rkm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
        @media (max-width:1024px){.rkm-grid{grid-template-columns:repeat(2,1fr)}}
        @media (max-width:640px){.rkm-grid{grid-template-columns:1fr}}
        .rkm-card{background:linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.01));border:1px solid var(--line);border-radius:16px;overflow:hidden;position:relative}
        .rkm-badge{position:absolute;top:12px;right:12px;background:var(--chip);color:#b3c1ff;border:1px solid #2c3557;font-size:12px;padding:6px 10px;border-radius:999px}
        .rkm-card header{padding:18px 18px 0}
        .rkm-title{display:flex;align-items:center;gap:8px}
        .rkm-dot{width:10px;height:10px;border-radius:50%}
        .rkm-free .rkm-dot{background:#60a5fa}
        .rkm-basic .rkm-dot{background:var(--ok)}
        .rkm-mid .rkm-dot{background:#38bdf8}
        .rkm-premium .rkm-dot{background:var(--acc)}
        .rkm-card h3{margin:0;font-size:20px}
        .rkm-desc{color:var(--muted);font-size:14px;margin:6px 0 0}
        .rkm-price{display:flex;gap:10px;flex-wrap:wrap;padding:16px 18px 0}
        .rkm-pill{background:var(--chip);border:1px solid #2a334a;color:#d9e3ff;padding:6px 10px;border-radius:999px;font-size:13px}
        .rkm-body{padding:14px 18px 0}
        .rkm-limit{background:#0f1420;border:1px dashed #243047;color:#cfe0ff;padding:10px 12px;border-radius:12px;font-size:13px;margin:0 18px}
        .rkm-list{margin:12px 0 0;padding:0 18px 18px;list-style:none}
        .rkm-list li{display:flex;gap:8px;align-items:flex-start;margin:8px 0;color:#dbe6ff;font-size:14px}
        .rkm-cta{padding:0 18px 18px}
        .rkm-btn{width:100%;padding:12px 14px;border-radius:12px;border:1px solid #2a334a;background:#151b27;color:#e9f1ff;font-weight:600;cursor:pointer;transition:.2s}
        .rkm-btn:hover{transform:translateY(-1px);background:#192235}
        .rkm-btn.primary{background:linear-gradient(180deg,#8147ff,#5b2bd6);border-color:#6b3bf0}
        .rkm-btn.primary:hover{filter:brightness(1.05)}
        .muted{color:var(--muted)}
      `}</style>

      <div className="rkm-wrap">
        <div className="rkm-head">
          <h2>Planos RKMMax</h2>
          <p>Valores e limites vindos das variáveis de ambiente ({region}).</p>
        </div>

        <div className="rkm-grid">
          {/* FREE */}
          <article className="rkm-card rkm-free">
            <header>
              <div className="rkm-title">
                <span className="rkm-dot" /><h3>Gratuito</h3>
              </div>
              <p className="rkm-desc">Escolha entre vídeo, banner e quiz para ganhar mensagens.</p>
            </header>
            <div className="rkm-price">
              <span className="rkm-pill">{region === "BR" ? `Brasil: ${lbl.free}/mês` : `Exterior: ${lbl.free}/mês`}</span>
            </div>
            <div className="rkm-body">
              <p className="rkm-limit"><strong>Limite:</strong> {limits.free}</p>
            </div>
            <div className="rkm-cta">
              <button className="rkm-btn" onClick={() => (window.location.href = "/app?plan=free")}>
                Começar grátis
              </button>
            </div>
          </article>

          {/* BASIC */}
          <article className="rkm-card rkm-basic">
            <span className="rkm-badge">Mais popular</span>
            <header>
              <div className="rkm-title">
                <span className="rkm-dot" /><h3>Básico</h3>
              </div>
              <p className="rkm-desc">Sem anúncios. Ideal para uso diário com folga.</p>
            </header>
            <div className="rkm-price">
              <span className="rkm-pill">
                {region === "BR" ? `Brasil: ${lbl.basic}/mês` : `Exterior: ${lbl.basic}/mês`}
              </span>
            </div>
            <div className="rkm-body">
              <p className="rkm-limit"><strong>Limite:</strong> {limits.basic}</p>
            </div>
            <div className="rkm-cta">
              <button
                className="rkm-btn primary"
                onClick={() =>
                  startCheckout(
                    region === "BR"
                      ? import.meta.env.VITE_STRIPE_PRICE_BASIC_BR
                      : import.meta.env.VITE_STRIPE_PRICE_BASIC_US
                  )
                }
              >
                Assinar Básico
              </button>
            </div>
          </article>

          {/* MID */}
          <article className="rkm-card rkm-mid">
            <header>
              <div className="rkm-title">
                <span className="rkm-dot" /><h3>Intermediário</h3>
              </div>
              <p className="rkm-desc">Mais profundidade com gpt-4.1-mini quando necessário.</p>
            </header>
            <div className="rkm-price">
              <span className="rkm-pill">
                {region === "BR" ? `Brasil: ${lbl.mid}/mês` : `Exterior: ${lbl.mid}/mês`}
              </span>
            </div>
            <div className="rkm-body">
              <p className="rkm-limit"><strong>Limite:</strong> {limits.mid}</p>
            </div>
            <div className="rkm-cta">
              <button
                className="rkm-btn"
                onClick={() =>
                  startCheckout(
                    region === "BR"
                      ? import.meta.env.VITE_STRIPE_PRICE_MID_BR
                      : import.meta.env.VITE_STRIPE_PRICE_MID_US
                  )
                }
              >
                Assinar Intermediário
              </button>
            </div>
          </article>

          {/* PREMIUM */}
          <article className="rkm-card rkm-premium">
            <span className="rkm-badge">Completo</span>
            <header>
              <div className="rkm-title">
                <span className="rkm-dot" /><h3>Premium</h3>
              </div>
              <p className="rkm-desc">Poder total e gpt-5 com cota mensal.</p>
            </header>
            <div className="rkm-price">
              <span className="rkm-pill">
                {region === "BR" ? `Brasil: ${lbl.premium}/mês` : `Exterior: ${lbl.premium}/mês`}
              </span>
            </div>
            <div className="rkm-body">
              <p className="rkm-limit"><strong>Limites:</strong> {limits.premium}</p>
            </div>
            <div className="rkm-cta">
              <button
                className="rkm-btn primary"
                onClick={() =>
                  startCheckout(
                    region === "BR"
                      ? import.meta.env.VITE_STRIPE_PRICE_PREMIUM_BR
                      : import.meta.env.VITE_STRIPE_PRICE_PREMIUM_US
                  )
                }
              >
                Assinar Premium
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
