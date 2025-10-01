// src/pages/Subscribe.jsx
import React, { useMemo, useState } from "react";

const LINKS = {
  BR: {
    basic:  "https://buy.stripe.com/cNi8wPaZh7IjfIVeHz3oA0i",
    pro:    "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0a",
    premium:"", // cole aqui quando criar
    labels: {
      basic:   "Básico — R$ 14,90/mês",
      pro:     "Intermediário — R$ 50,00/mês",
      premium: "Premium — R$ 90,00/mês"
    }
  },
  US: {
    basic:  "https://buy.stripe.com/00w14naZh0fR1S51UN3oA09",
    pro:    "https://buy.stripe.com/3c14gZebt8MmgM2ZXR3oAg",
    premium:"", // cole aqui quando criar
    labels: {
      basic:   "Basic — $10/month",
      pro:     "Intermediate — $25/month",   // <- corrigido
      premium: "Premium — $30/month"
    }
  }
};

function detectRegion() {
  const lang = (navigator.language || "en-US").toLowerCase();
  return lang.startsWith("pt") ? "BR" : "US";
}

export default function Subscribe() {
  const [region, setRegion] = useState(detectRegion());
  const R = useMemo(() => (region === "BR" ? LINKS.BR : LINKS.US), [region]);

  const go = (planKey) => {
    const url = R[planKey];
    if (!url) return alert("Link ainda não disponível para este plano.");
    window.location.href = url;
  };

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h1>Assinar</h1>
      <p>Região detectada: <b>{region}</b></p>

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => setRegion("BR")} style={{ marginRight: 8 }}>BR</button>
        <button onClick={() => setRegion("US")}>US</button>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <button onClick={() => go("basic")}>{R.labels.basic}</button>
        <button onClick={() => go("pro")}>{R.labels.pro}</button>
        <button
          onClick={() => go("premium")}
          disabled={!R.premium}                 // desativa se não tiver link
          style={{ opacity: R.premium ? 1 : 0.6 }}
        >
          {R.labels.premium}
        </button>
      </div>

      <p style={{ marginTop: 16, fontSize: 12, opacity: 0.8 }}>
        * O valor exibido é apenas rótulo de UI; a cobrança vem do Payment Link da Stripe.
      </p>
    </div>
  );
}
