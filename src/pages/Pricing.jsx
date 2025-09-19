// src/pages/Pricing.jsx
import React from "react";

// 🔗 Cole seus links do Stripe aqui.
// Se deixar "", o botão fica desabilitado e mostra alerta.
const LINKS = {
  // BRL
  BASIC_BR: "",          // ex: "https://buy.stripe.com/xxxx"
  INTER_BR: "",          // ex: R$ 29,90
  PREMIUM_BR: "",        // ex: R$ 90,00

  // USD
  BASIC_US: "",          // ex: US$ 10
  INTER_US: "",          // ex: US$ 20
  PREMIUM_US: "",        // ex: US$ 30
};

function PlanCard({ title, price, period = "/mês", features = [], link }) {
  const enabled = Boolean(link && link.startsWith("http"));
  const handleClick = (e) => {
    if (!enabled) {
      e.preventDefault();
      alert("Link de pagamento ainda não configurado.");
    }
  };

  return (
    <div className="plan-card" style={styles.card}>
      <h3 style={styles.title}>{title}</h3>
      <p style={styles.price}>
        <strong>{price}</strong> <span style={{ opacity: 0.75 }}>{period}</span>
      </p>
      <ul style={styles.list}>
        {features.map((f, i) => (
          <li key={i}>{f}</li>
        ))}
      </ul>

      <a
        href={enabled ? link : "#"}
        target="_blank"
        rel="noreferrer noopener"
        onClick={handleClick}
        style={{
          ...styles.btn,
          ...(enabled ? {} : styles.btnDisabled),
        }}
      >
        Assinar
      </a>
    </div>
  );
}

export default function Pricing() {
  return (
    <section style={styles.page}>
      <h1 style={styles.h1}>Planos RKMMAX</h1>

      {/* 🇧🇷 BRL */}
      <h2 style={styles.h2}>Brasil (BRL)</h2>
      <div style={styles.grid}>
        <PlanCard
          title="Básico"
          price="R$ 14,90"
          features={[
            "Funções essenciais",
            "Limite inteligente de conversas",
            "Suporte inicial",
          ]}
          link={LINKS.BASIC_BR}
        />
        <PlanCard
          title="Intermediário"
          price="R$ 29,90"
          features={[
            "Todos os agentes liberados",
            "Suporte a voz (Whisper + TTS)",
            "Prioridade no atendimento",
          ]}
          link={LINKS.INTER_BR}
        />
        <PlanCard
          title="Premium"
          price="R$ 90,00"
          features={[
            "GPT-5 Standard + GPT-4.1 Mini",
            "Limites expandidos",
            "Suporte prioritário",
          ]}
          link={LINKS.PREMIUM_BR}
        />
      </div>

      {/* 🇺🇸 USD */}
      <h2 style={styles.h2}>Estados Unidos (USD)</h2>
      <div style={styles.grid}>
        <PlanCard
          title="Basic"
          price="US$ 10,00"
          period="/month"
          features={["Essential features", "Smart chat limit", "Starter support"]}
          link={LINKS.BASIC_US}
        />
        <PlanCard
          title="Intermediate"
          price="US$ 20,00"
          period="/month"
          features={[
            "All agents unlocked",
            "Voice support",
            "Priority responses",
          ]}
          link={LINKS.INTER_US}
        />
        <PlanCard
          title="Premium"
          price="US$ 30,00"
          period="/month"
          features={[
            "Max precision & power",
            "Higher limits",
            "Top server priority",
          ]}
          link={LINKS.PREMIUM_US}
        />
      </div>

      <p style={{ marginTop: 18, opacity: 0.8 }}>
        Após o pagamento, o acesso é liberado imediatamente no app.
      </p>
    </section>
  );
}

const styles = {
  page: { maxWidth: 980, margin: "0 auto", padding: "24px 16px" },
  h1: { fontSize: 28, textAlign: "center", margin: "8px 0 24px" },
  h2: { fontSize: 20, margin: "24px 0 12px" },
  grid: {
    display: "grid",
    gap: 16,
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    marginBottom: 8,
  },
  card: {
    background: "white",
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 4px 14px rgba(0,0,0,.08)",
    border: "1px solid rgba(0,0,0,.06)",
  },
  title: { margin: "4px 0 8px", fontSize: 18 },
  price: { margin: "0 0 10px", fontSize: 18 },
  list: { margin: "0 0 14px 18px" },
  btn: {
    display: "inline-block",
    textAlign: "center",
    textDecoration: "none",
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #00ffdb",
    background: "#00ffdb",
    color: "#003366",
    fontWeight: "bold",
  },
  btnDisabled: {
    background: "#e9ecef",
    borderColor: "#e9ecef",
    color: "#666",
    cursor: "not-allowed",
  },
};
