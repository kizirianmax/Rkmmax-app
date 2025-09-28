// src/pages/Home.jsx
import React from "react";
import usePlan from "../hooks/usePlan";

export default function Home() {
  const { plan } = usePlan(); // "free" | "premium"

  // estilos reutilizáveis
  const styles = {
    page: {
      maxWidth: 1100,
      margin: "0 auto",
      padding: "20px 16px 40px",
      fontFamily: `system-ui, -apple-system, "Segoe UI", Roboto, Ubuntu, "Helvetica Neue", Arial`,
      color: "#0f172a",
      lineHeight: 1.45,
    },
    title: {
      fontSize: "clamp(22px, 5vw, 40px)",
      lineHeight: 1.2,
      letterSpacing: -0.5,
      margin: "4px 0 8px",
      fontWeight: 800,
    },
    sub: {
      fontSize: "clamp(14px, 3.8vw, 18px)",
      color: "#334155",
      margin: "0 0 16px",
    },
    card: {
      position: "relative",
      display: "flex",
      gap: 14,
      padding: "16px 16px",
      borderRadius: 16,
      boxShadow:
        "0 8px 24px rgba(15,23,42,.06), 0 2px 6px rgba(15,23,42,.04)",
      background: "#fff",
    },
    avatar: { width: 48, height: 48, borderRadius: 12, flexShrink: 0 },
    h2: {
      fontSize: "clamp(18px, 4.8vw, 26px)",
      margin: 0,
      fontWeight: 800,
      color: "#0b1220",
    },
    role: { margin: "2px 0 0", fontSize: 14, color: "#64748b", fontWeight: 700 },
    p: { margin: "10px 0 14px", fontSize: "clamp(14px,3.8vw,16px)" },
    cta: {
      display: "inline-block",
      padding: "12px 16px",
      borderRadius: 12,
      fontWeight: 800,
      fontSize: "clamp(14px,3.8vw,16px)",
      color: "#fff",
      textDecoration: "none",
      background:
        "linear-gradient(90deg, #2563eb 0%, #7c3aed 100%)",
      boxShadow: "0 10px 24px rgba(124,58,237,.22)",
    },
    badgeFree: {
      position: "absolute",
      right: 12,
      top: 12,
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid #86efac",
      color: "#15803d",
      background: "rgba(240,253,244,.9)",
      fontSize: 12,
      fontWeight: 700,
    },
    sectionTitleRow: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      margin: "18px 2px 10px",
    },
    sectionTitle: {
      fontSize: "clamp(16px,4.6vw,22px)",
      fontWeight: 900,
      letterSpacing: -.3,
    },
    link: { color: "#3730a3", fontWeight: 700, fontSize: 14, textDecoration: "none" },

    // carrossel
    carousel: {
      display: "grid",
      gridAutoFlow: "column",
      gridAutoColumns: "minmax(68%, 1fr)",
      gap: 12,
      overflowX: "auto",
      padding: "2px 2px 4px",
      scrollSnapType: "x mandatory",
    },
    agentPill: {
      scrollSnapAlign: "start",
      display: "flex",
      alignItems: "center",
      gap: 10,
      background: "#fff",
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: "10px 12px",
      boxShadow: "0 4px 14px rgba(15,23,42,.04)",
    },
    pillIcon: { width: 34, height: 34, borderRadius: 8 },
    pillName: { fontWeight: 800, fontSize: 15, color: "#0f172a" },
    pillBadge: {
      marginLeft: "auto",
      padding: "4px 10px",
      borderRadius: 999,
      border: "1px solid #c7d2fe",
      background: "rgba(238,242,255,.85)",
      color: "#3730a3",
      fontSize: 12,
      fontWeight: 800,
    },

    // card Planos (compacto)
    plansList: { margin: "8px 0 0", paddingLeft: 18, color: "#344256" },
    plansItem: { margin: "4px 0" },
    plansCta: {
      display: "inline-block",
      padding: "10px 14px",
      borderRadius: 12,
      border: "1px solid #cbd5e1",
      background: "#fff",
      fontWeight: 800,
      textDecoration: "none",
      fontSize: "clamp(14px,3.8vw,16px)",
      color: "#0f172a",
    },
  };

  // dados do preview (3 primeiros)
  const preview = [
    { id: "emo", name: "Emo", icon: "/avatars/emo.svg" },
    { id: "didak", name: "Didak", icon: "/avatars/didak.svg" },
    { id: "finna", name: "Finna", icon: "/avatars/finna.svg" },
  ];

  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Bem-vindo ao RKMMAX 🚀</h1>
      <p style={styles.sub}>
        Use nossa IA com assinatura segura via Stripe. Comece pelo Serginho (grátis) ou destrave os 12 especialistas no plano Premium.
      </p>

      {/* Serginho */}
      <section style={{ ...styles.card, marginBottom: 14 }}>
        <img src="/avatars/serginho.png" alt="Serginho" style={styles.avatar} />
        <div>
          <h2 style={styles.h2}>Serginho</h2>
          <p style={styles.role}>Orquestrador</p>
          <p style={styles.p}>
            Agente especial e generalista. Orquestra os 12 especialistas, supervisiona e articula todas as interações para resolver qualquer tarefa.
          </p>
          <a href="/agents" className="btn" style={styles.cta}>
            Explorar Especialistas (Premium)
          </a>
        </div>
        <div style={styles.badgeFree} aria-label="Disponível em todos os planos">Livre</div>
      </section>

      {/* Especialistas (preview) – vem antes dos planos */}
      <div style={styles.sectionTitleRow}>
        <h3 style={styles.sectionTitle}>Especialistas (preview)</h3>
        <a href="/agents" style={styles.link}>Ver todos os 12</a>
      </div>

      <div style={styles.carousel} aria-label="Carrossel de especialistas">
        {preview.map((a) => (
          <div key={a.id} style={styles.agentPill}>
            <img src={a.icon} alt={a.name} style={styles.pillIcon} />
            <span style={styles.pillName}>{a.name}</span>
            <span style={styles.pillBadge}>Premium</span>
          </div>
        ))}
      </div>

      {/* CTA para destravar – ocupa pouco espaço */}
      <div style={{ margin: "12px 2px 18px" }}>
        <a href="/pricing" style={{ ...styles.cta, width: "100%", textAlign: "center", display: "block" }}>
          Destravar Especialistas (Premium)
        </a>
      </div>

      {/* Planos – card compacto */}
      <section style={{ ...styles.card }}>
        <img src="/avatars/emo.svg" alt="Planos" style={styles.avatar} />
        <div>
          <h2 style={styles.h2}>Planos</h2>
          <p style={styles.role}>Assine com segurança</p>
          <p style={styles.p}>
            Planos claros, checkout Stripe e acesso imediato no app. Suporte e upgrades simples para crescer junto com você.
          </p>

          <a href="/pricing" style={styles.plansCta}>Ver planos</a>

          <ul style={styles.plansList}>
            <li style={styles.plansItem}>• SSL/TLS automático</li>
            <li style={styles.plansItem}>• Checkout Stripe</li>
            <li style={styles.plansItem}>• PWA Android/iOS</li>
            <li style={styles.plansItem}>• 12 Especialistas + Orquestrador</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
