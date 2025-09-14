// src/pages/PricingTable.jsx
import React, { useMemo, useState } from "react";

const PRICES = {
  BR: {
    basic: import.meta.env.VITE_STRIPE_PRICE_BASIC_BR,
    top: import.meta.env.VITE_STRIPE_PRICE_TOP_BR,
  },
  US: {
    basic: import.meta.env.VITE_STRIPE_PRICE_BASIC_US,
    mid: import.meta.env.VITE_STRIPE_PRICE_MID_US,
    top: import.meta.env.VITE_STRIPE_PRICE_TOP_US,
  },
};

function PlanCard({ title, priceLabel, features = [], cta, onClick, disabled }) {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 12,
        padding: 16,
        background: "rgba(255,255,255,0.03)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h3 style={{ margin: 0 }}>{title}</h3>
      {priceLabel && <div style={{ opacity: 0.8 }}>{priceLabel}</div>}
      <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.5 }}>
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>
      {cta && (
        <button
          onClick={onClick}
          disabled={disabled}
          style={{
            marginTop: 8,
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.14)",
            background: disabled ? "rgba(255,255,255,0.08)" : "rgba(124,58,237,0.2)",
            color: "white",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}

export default function PricingTable() {
  // região padrão: se o navegador estiver em pt, BR; senão US
  const defaultRegion = useMemo(
    () => (navigator.language?.toLowerCase().startsWith("pt") ? "BR" : "US"),
    []
  );
  const [region, setRegion] = useState(defaultRegion);

  async function openCheckout(priceId) {
    try {
      if (!priceId) {
        alert("Preço não configurado. Verifique as variáveis no Netlify.");
        return;
      }
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Falha ao criar sessão");

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("Resposta sem URL de checkout");
      }
    } catch (err) {
      console.error(err);
      alert(`Não foi possível abrir o checkout. Veja os logs da Function.\n\n${err.message}`);
    }
  }

  const isBR = region === "BR";

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 16 }}>
      <h1 style={{ textAlign: "center", marginBottom: 8 }}>Planos RKMMAX</h1>
      <p style={{ textAlign: "center", opacity: 0.8, marginTop: 0 }}>
        Valores e limites vindos das variáveis de ambiente ({isBR ? "BR" : "US"}).
      </p>

      {/* Toggle de região */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, margin: "16px 0 24px" }}>
        <button
          onClick={() => setRegion("BR")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.14)",
            background: isBR ? "rgba(124,58,237,0.25)" : "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Brasil (BRL)
        </button>
        <button
          onClick={() => setRegion("US")}
          style={{
            padding: "8px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.14)",
            background: !isBR ? "rgba(124,58,237,0.25)" : "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          International (USD)
        </button>
      </div>

      {/* Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {/* Free */}
        <PlanCard
          title="Gratuito"
          priceLabel={isBR ? "Brasil: R$0/mês" : "US: $0/month"}
          features={[
            "Escolha entre vídeo, banner e quiz para ganhar mensagens.",
            isBR
              ? "Limite: 10 mensagens/dia (gpt-4o-mini) + extras por anúncios"
              : "Limit: 10 messages/day (gpt-4o-mini) + ads extras",
          ]}
          cta="Começar grátis"
          onClick={() => alert("Plano gratuito já está ativo 🙂")}
        />

        {/* Basic */}
        <PlanCard
          title="Básico"
          priceLabel={isBR ? "Brasil: R$14,90/mês" : "US: $2.99/month"}
          features={[
            "Assinatura mensal, cobrança automática",
            "Códigos promocionais permitidos",
          ]}
          cta="Assinar Básico"
          onClick={() => openCheckout(isBR ? PRICES.BR.basic : PRICES.US.basic)}
        />

        {/* Mid - só US */}
        {!isBR && (
          <PlanCard
            title="Intermediário"
            priceLabel="US: $4.99/month"
            features={[
              "Mais profundidade com modelos maiores quando necessário",
              "Códigos promocionais permitidos",
            ]}
            cta="Assinar Intermediário"
            onClick={() => openCheckout(PRICES.US.mid)}
          />
        )}

        {/* Top */}
        <PlanCard
          title="Top"
          priceLabel={isBR ? "Brasil: R$24,90/mês" : "US: $7.99/month"}
          features={[
            "Limites diários maiores",
            "Códigos promocionais permitidos",
          ]}
          cta="Assinar Top"
          onClick={() => openCheckout(isBR ? PRICES.BR.top : PRICES.US.top)}
        />
      </div>

      {/* Aviso de publishable key só para conferência (não é requerida aqui, mas ajuda debug) */}
      {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
        <p style={{ marginTop: 20, color: "#fca5a5" }}>
          Aviso: VITE_STRIPE_PUBLISHABLE_KEY não está definida. Para o Checkout redirecionado não é
          obrigatório, mas recomendo manter configurada para futuros recursos no client.
        </p>
      )}
    </div>
  );
}
