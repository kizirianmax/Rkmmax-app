// src/pages/Home.jsx
import React from "react";
import usePlan from "../hooks/usePlan";

export default function Home() {
  const { plan } = usePlan(); // "free" | "premium"

  // --- estilos reutilizáveis (inline, sem dependências externas) ---
  const styles = {
    page: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "24px 20px 56px",
      fontFamily: `system-ui, -apple-system, "Segoe UI", Roboto, Inter, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
      color: "#0f172a",
      lineHeight: 1.45,
    },
    hero: { marginBottom: 28 },
    title: {
      fontSize: 32,
      fontWeight: 800,
      letterSpacing: -0.5,
      margin: "0 0 8px",
    },
    subtitle: {
      fontSize: 16,
      color: "#334155",
      margin: 0,
      maxWidth: 780,
    },
    grid: {
      display: "grid",
      gap: 16,
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      alignItems: "stretch",
      marginTop: 20,
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e5e7eb",
      borderRadius: 16,
      padding: 18,
      boxShadow:
        "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(15, 23, 42, 0.05)",
    },
    top: { display: "flex", gap: 14, alignItems: "center", marginBottom: 10 },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 14,
      background: "#f1f5f9",
      objectFit: "cover",
      display: "block",
    },
    name: { fontSize: 20, fontWeight: 700, margin: 0 },
    role: { margin: "2px 0 0", fontSize: 14, color: "#475569" },
    desc: { margin: "10px 0 16px", color: "#334155" },
    cta: {
      display: "inline-block",
      padding: "10px 14px",
      borderRadius: 12,
      fontWeight: 700,
      textDecoration: "none",
      background:
        "linear-gradient(135deg, #0ea5e9 0%, #6366f1 55%, #8b5cf6 100%)",
      color: "white",
      boxShadow: "0 6px 20px rgba(99,102,241,.35)",
      transition: "transform .06s ease",
    },
    ctaGhost: {
      display: "inline-block",
      padding: "10px 14px",
      borderRadius: 12,
      fontWeight: 700,
      textDecoration: "none",
      color: "#0f172a",
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
      transition: "transform .06s ease",
    },
    features: {
      marginTop: 10,
      padding: 12,
      background: "#f8fafc",
      border: "1px dashed #e5e7eb",
      borderRadius: 12,
      color: "#334155",
      fontSize: 14,
    },
    link: { color: "#0ea5e9", textDecoration: "none", fontWeight: 700 },
  };

  const Avatar = ({ src }) => (
    <img
      src={src}
      alt=""
      style={styles.avatar}
      onError={(e) => {
        // fallback para png se o svg não existir
        if (src.endsWith(".svg")) e.currentTarget.src = src.replace(".svg", ".png");
      }}
    />
  );

  return (
    <div style={styles.page}>
      {/* HERO */}
      <header style={styles.hero}>
        <h1 style={styles.title}>Bem-vindo ao RKMMAX 🚀</h1>
        <p style={styles.subtitle}>
          Use nossa IA com assinatura segura via Stripe. Comece pelo Serginho
          (grátis) ou destrave os 12 especialistas no plano Premium.
        </p>
      </header>

      {/* GRID DE CARDS */}
      <div style={styles.grid}>
        {/* Card: Serginho */}
        <section style={styles.card}>
          <div style={styles.top}>
            <Avatar src="/avatars/serginho.svg" />
            <div>
              <h3 style={styles.name}>Serginho</h3>
              <p style={styles.role}>Orquestrador</p>
            </div>
          </div>

          <p style={styles.desc}>
            Agente especial e generalista. Orquestra os 12 especialistas,
            supervisiona e articula todas as interações para resolver qualquer
            tarefa.
          </p>

          <a href="/agents" style={styles.cta}>
            {plan === "premium"
              ? "Explorar Especialistas"
              : "Explorar Especialistas (Premium)"}
          </a>
        </section>

        {/* Card: Planos */}
        <section style={styles.card}>
          <div style={styles.top}>
            <Avatar src="/avatars/emo.svg" />
            <div>
              <h3 style={styles.name}>Planos</h3>
              <p style={styles.role}>Assine com segurança</p>
            </div>
          </div>

          <p style={styles.desc}>
            Planos claros, pagamento via Stripe e acesso imediato no app.
            Suporte e upgrades simples para crescer junto com você.
          </p>

          <a href="/pricing" style={styles.ctaGhost}>
            Ver planos
          </a>

          <div style={styles.features}>
            <div>• SSL/TLS automático</div>
            <div>• Checkout Stripe</div>
            <div>• PWA Android/iOS</div>
            <div>• 12 Especialistas + Orquestrador</div>
          </div>
        </section>
      </div>

      {/* Rodapé curtinho */}
      <p style={{ marginTop: 28, color: "#64748b", fontSize: 13 }}>
        Dica: para ícones nítidos, salve os avatares em{" "}
        <code>public/avatars/</code> como <strong>SVG</strong> (ex.:{" "}
        <code>serginho.svg</code>, <code>emo.svg</code>). O componente já faz
        fallback para <code>.png</code> se o <code>.svg</code> não existir.
      </p>
    </div>
  );
}
