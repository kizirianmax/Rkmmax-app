import React, { useState } from "react";
import plansJson from "../../config/plans.json";

export default function PricingTable() {
  const [tab, setTab] = useState("BR"); // BR | US

  const br = [
    plansJson.plans.basic_br,
    plansJson.plans.intermediario_br,
    plansJson.plans.premium_br,
  ];
  const us = [
    plansJson.plans.basic_us,
    plansJson.plans.intermediate_us,
    plansJson.plans.premium_us,
  ];

  const plans = tab === "BR" ? br : us;

  return (
    <section className="pricing">
      <h2>Planos RKMMAX</h2>
      <div className="tabs">
        <button onClick={() => setTab("BR")}>Brasil (BRL)</button>
        <button onClick={() => setTab("US")}>International (USD)</button>
      </div>

      <div className="card">
        <h3>Gratuito</h3>
        <p>{tab === "BR" ? "Brasil: R$0/mês" : "US: $0/month"}</p>
        <ul>
          <li>Escolha entre vídeo, banner e quiz para ganhar mensagens</li>
          <li>Limite: 10 mensagens/dia (gpt-4o-mini) + extras por anúncios</li>
        </ul>
        <button>{tab === "BR" ? "Começar grátis" : "Start Free"}</button>
      </div>

      <div className="cards">
        {plans.map((p) => (
          <div key={p.lookup_key} className="card">
            <h3>{p.name.split("–")[0].trim()}</h3>
            <p>
              {p.currency === "BRL"
                ? `Brasil: R$${p.price}/mês`
                : `US: $${p.price}/month`}
            </p>
            <ul>
              {p.model === "gpt-5-nano" && (
                <>
                  <li>Assinatura mensal, cobrança automática</li>
                  <li>Códigos promocionais permitidos</li>
                </>
              )}
              {p.model === "gpt-4.1-mini" && (
                <>
                  <li>Mais profundidade com modelos maiores quando necessário</li>
                  <li>Códigos promocionais permitidos</li>
                </>
              )}
              {p.model === "gpt-5-standard" && (
                <>
                  <li>Limites diários maiores</li>
                  <li>Códigos promocionais permitidos</li>
                </>
              )}
            </ul>
            <button>Assinar {p.name.split("–")[0].trim()}</button>
          </div>
        ))}
      </div>
    </section>
  );
}
