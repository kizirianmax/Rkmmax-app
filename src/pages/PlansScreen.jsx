import React from "react";
import { Link } from "react-router-dom";

function PricingCard({
  badge,
  title,
  price,
  period = "/mês",
  description,
  features = [],
  ctaTo,
  highlighted = false,
}) {
  return (
    <div
      style={{
        background: highlighted ? "#0b1020" : "#0f1424",
        border: highlighted ? "1px solid #3b82f6" : "1px solid #1f2a44",
        boxShadow: highlighted
          ? "0 10px 30px rgba(59,130,246,0.35)"
          : "0 6px 16px rgba(0,0,0,0.25)",
        borderRadius: 16,
        padding: 20,
        color: "#e5ecff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        minHeight: 420,
      }}
    >
      <div>
        {badge && (
          <div
            style={{
              display: "inline-block",
              padding: "6px 10px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.2,
              color: highlighted ? "#0b1020" : "#0f1424",
              background: highlighted ? "#93c5fd" : "#60a5fa",
              marginBottom: 12,
            }}
          >
            {badge}
          </div>
        )}

        <h3 style={{ margin: "6px 0 4px", fontSize: 22 }}>{title}</h3>

        <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
          <span style={{ fontSize: 34, fontWeight: 800 }}>{price}</span>
          <span style={{ opacity: 0.85 }}>{period}</span>
        </div>

        {description && (
          <p style={{ opacity: 0.9, marginTop: 10, lineHeight: 1.5 }}>
            {description}
          </p>
        )}

        <ul style={{ margin: "16px 0 0", padding: 0, listStyle: "none" }}>
          {features.map((f, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 0",
                borderBottom:
                  i === features.length - 1 ? "none" : "1px dashed #203058",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 4,
                  background: "#22c55e",
                  display: "inline-block",
                  marginTop: 2,
                }}
              />
              <span style={{ lineHeight: 1.5 }}>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        to={ctaTo}
        style={{
          marginTop: 18,
          textAlign: "center",
          textDecoration: "none",
          background: highlighted
            ? "linear-gradient(135deg,#60a5fa,#3b82f6)"
            : "linear-gradient(135deg,#334155,#1f2937)",
          color: "#fff",
          padding: "12px 16px",
          borderRadius: 10,
          border: highlighted ? "1px solid #60a5fa" : "1px solid #334155",
          fontWeight: 700,
          letterSpacing: 0.2,
        }}
      >
        Assinar
      </Link>
    </div>
  );
}

export default function PlansScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(1200px 600px at 20% -10%, rgba(59,130,246,.18), transparent), radial-gradient(1000px 500px at 120% 10%, rgba(168,85,247,.18), transparent), #0a0f1c",
        color: "#e5ecff",
      }}
    >
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "36px 16px" }}>
        <header style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ margin: 0, fontSize: 36 }}>Planos RKMMax</h1>
          <p style={{ marginTop: 10, opacity: 0.9 }}>
            Conversas ilimitadas* com limites inteligentes para manter a
            performance e a qualidade.
          </p>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
            gap: 18,
            alignItems: "stretch",
          }}
        >
          <PricingCard
            title="Básico"
            price="R$ 14,90"
            description="Para começar com tudo sem gastar muito."
            features={[
              "Modelo GPT-4o mini (rápido e econômico)",
              "Conversas ilimitadas* (limite inteligente ~65/dia)",
              "Acesso ao Serginho + agentes essenciais",
              "Suporte essencial",
            ]}
            ctaTo="/subscribe/simple"
          />

          <PricingCard
            badge="Recomendado"
            title="Intermediário"
            price="R$ 29,90"
            description="Mais fôlego para estudar e trabalhar diariamente."
            features={[
              "Modelo GPT-4o mini (ótima qualidade)",
              "Conversas ilimitadas* (limite inteligente ~200/dia)",
              "Agentes extras e melhor contexto",
              "Respostas priorizadas",
            ]}
            ctaTo="/subscribe/medium"
            highlighted
          />

          <PricingCard
            title="Premium"
            price="R$ 49,00"
            description="Poder máximo e precisão para tarefas críticas."
            features={[
              "Modelo GPT-4o (completo)",
              "Limite inteligente: 25 respostas GPT-4o/dia",
              "Prioridade máxima no servidor",
              "Melhor assertividade e profundidade",
            ]}
            ctaTo="/subscribe/top"
          />
        </div>

        <footer style={{ marginTop: 26, textAlign: "center", opacity: 0.8 }}>
          <small>
            *“Ilimitadas” significa uso sem contadores visíveis, com limites
            inteligentes por plano para manter estabilidade e qualidade do
            serviço.
          </small>
        </footer>
      </div>
    </div>
  );
}
