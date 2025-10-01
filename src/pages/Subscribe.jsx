// src/pages/Subscribe.jsx
import React, { useMemo, useState } from "react";

// Links de pagamento (Payment Links) por região e plano
const LINKS = {
  BR: {
    basic:  "https://buy.stripe.com/cNi8wPaZh7IjfIVeHz3oA0i",
    pro:    "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0a",
    premium:"https://buy.stripe.com/00w6oHaZhfaLCwJczr3oA0c", // ✅ Premium BR
    labels: {
      basic:   "Básico — R$ 14,90/mês",
      pro:     "Intermediário — R$ 50,00/mês",
      premium: "Premium — R$ 90,00/mês"
    }
  },
  US: {
    basic:  "https://buy.stripe.com/00w14naZh0fR1S51UN3oA09",
    pro:    "https://buy.stripe.com/3c14gZebt8MmgM2ZXR3oAg",
    premium:"https://buy.stripe.com/test_XXXXXX", // 🔴 Substitua pelo link real Premium US
    labels: {
      basic:   "Basic — $10/month",
      pro:     "Intermediate — $20/month",
      premium: "Premium — $30/month"
    }
  }
};

// Detecção simples de região pelo idioma do navegador
function detectRegion() {
  const lang = (navigator.language || "en-US").toLowerCase();
  return lang.startsWith("pt") ? "BR" : "US";
}

export default function Subscribe() {
  const [region, setRegion] = useState(detectRegion());

  const R = useMemo(() => (region === "BR" ? LINKS.BR : LINKS.US), [region]);

  const go = (planKey) => {
    const url = R[planKey];
    if (!url) {
      alert("Link ainda não disponível para este plano.");
      return;
    }
    window.location.href = url; // redireciona direto para a Stripe
  };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h1>Assinar</h1>
      <p>
        Região detectada: <b>{region}</b>
      </p>

      {/* Botões para trocar manualmente BR/US (útil para testes) */}
      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setRegion("BR")} style={{ marginRight: 8 }}>
          BR
        </button>
        <button onClick={() => setRegion("US")}>US</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={() => go("basic")}>{R.labels.basic}</button>
        <button onClick={() => go("pro")}>{R.labels.pro}</button>
        <button onClick={() => go("premium")}>{R.labels.premium}</button>
      </div>

      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        * O valor exibido é apenas rótulo de UI; a cobrança é definida pelo
        Payment Link da Stripe.
      </p>
    </div>
  );
}
