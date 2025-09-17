// src/components/PricingTable.jsx
import React, { useState } from "react";
import plansJson from "../../plans.json"; // corrigido: agora puxa da raiz

export default function PricingTable() {
  const [tab, setTab] = useState("BR"); // "BR" ou "US"

  // monta listas a partir do plans.json
  const br = [
    plansJson.basic_br,
    plansJson.intermediate_br, // corrigido
    plansJson.premium_br,
  ];
  const us = [
    plansJson.basic_us,
    plansJson.intermediate_us,
    plansJson.premium_us,
  ];

  const list = tab === "BR" ? br : us;

  const handleCheckout = async (lookupKey) => {
    try {
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lookupKey }), // corrigido
      });

      if (!res.ok) throw new Error("Checkout request failed");

      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch (e) {
      alert("Preço não configurado. Verifique as variáveis no Netlify.");
      console.error(e);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 980, margin: "0 auto" }}>
      <h2 className="title">Planos RKMMAX</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          className={tab === "BR" ? "tab tab--active" : "tab"}
          onClick={() => setTab("BR")}
        >
          Brasil (BRL)
        </button>
        <button
          className={tab === "US" ? "tab tab--active" : "tab"}
          onClick={() => setTab("US")}
        >
          International (USD)
        </button>
      </div>

      {list.map((p) => (
        <div key={p.lookup_key} className="card">
          <h3>{p.name}</h3>
          <p>
            {tab === "BR" ? "Brasil" : "US"}: {p.price}/
            {p.billing === "monthly" ? "mês" : p.billing}
          </p>
          <ul>
            <li>Assinatura mensal, cobrança automática</li>
            <li>Códigos promocionais permitidos</li>
          </ul>
          <button
            className="btn"
            onClick={() => handleCheckout(p.lookup_key)}
            aria-label={`Assinar ${p.name}`}
          >
            Assinar RKMMAX
          </button>
        </div>
      ))}
    </div>
  );
}
