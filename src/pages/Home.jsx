import React from "react";

export default function Home() {
  return (
    <main style={styles.page}>
      <h1 style={styles.title}>Bem-vindo ao RKMMAX</h1>
      <p style={styles.sub}>
        Use nossa IA com assinatura segura via Stripe. Comece pelo{" "}
        <strong>Serginho (grátis)</strong> ou destrave os{" "}
        <strong>12 especialistas</strong> no plano Premium.
      </p>

      {/* Card Serginho */}
      <section style={styles.card}>
        <div style={styles.row}>
          <img
            src="/serginho.svg"
            alt="Serginho"
            style={styles.sergImg}
          />
          <div>
            <h2 style={styles.h2}>Serginho</h2>
            <p style={styles.role}>Orquestrador</p>
          </div>
          <div style={styles.badgeFree} aria-label="Disponível em todos os planos">
            Livre
          </div>
        </div>

        <p style={styles.p}>
          Agente especial e generalista. Orquestra os 12 especialistas,
          supervisiona e articula todas as interações para resolver qualquer tarefa.
        </p>

        <a href="/agents" style={styles.cta}>
          Explorar Especialistas (Premium)
        </a>

        {/* Especialistas preview */}
        <div style={styles.sectionHeader}>
          <h3 style={{ margin: "18px 0 6px", fontSize: 18, fontWeight: 800 }}>
            Especialistas (preview)
          </h3>
          <a href="/agents" style={styles.link}>Ver todos os 12</a>
        </div>

        <div style={styles.chipsRow}>
          {[
            { id: "emo", name: "Emo", icon: "💜" },
            { id: "didak", name: "Didak", icon: "📘" }
          ].map((it) => (
            <div key={it.id} style={styles.chip} role="button">
              <div style={styles.chipIcon}>{it.icon}</div>
              <div style={{ fontWeight: 800 }}>{it.name}</div>
              <span style={styles.chipBadge}>Premium</span>
            </div>
          ))}
        </div>

        <a href="/pricing" style={{ ...styles.cta, width: "100%", display: "block", textAlign: "center" }}>
          Destravar Especialistas (Premium)
        </a>
      </section>

      {/* Card Planos */}
      <section style={styles.card}>
        <div style={styles.row}>
          <div style={styles.plansIcon}>❤</div>
          <div>
            <h2 style={styles.h2}>Planos</h2>
            <p style={styles.role}>Assine com segurança</p>
          </div>
        </div>

        <p style={styles.p}>
          Planos claros, pagamento via Stripe e acesso imediato no app.
          Suporte e upgrades simples para crescer junto com você.
        </p>

        <a href="/pricing" style={styles.buttonDark}>Ver planos</a>

        <div style={styles.features}>
          • SSL/TLS automático
          <br />• Checkout Stripe
          <br />• PWA Android/iOS
          <br />• 12 Especialistas + Orquestrador
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "28px 16px 56px",
    fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    color: "#0f172a",
    lineHeight: 1.45,
  },
  title: { fontSize: 36, fontWeight: 800, letterSpacing: -0.5, margin: "0 0 8px" },
  sub: { margin: "0 0 28px", fontSize: 18, color: "#334155", maxWidth: 880 },
  grid: { display: "grid", gap: 16 },

  card: {
    background: "#fff",
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 10px 20px rgba(2,8,23,.06), 0 2px 6px rgba(2,8,23,.04)",
    marginBottom: 16,
  },
  row: { display: "flex", gap: 16, alignItems: "center" },
  badgeFree: {
    marginLeft: "auto",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 700,
    color: "#15803d",
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(21,128,61,.25)",
    backdropFilter: "blur(2px)",
  },
  sergImg: {
    width: 64, height: 64, borderRadius: 14, objectFit: "cover",
    background: "linear-gradient(180deg,#0ea5e9,#8b5cf6)",
    boxShadow: "inset 0 0 0 3px rgba(255,255,255,.75)",
    flexShrink: 0,
  },
  h2: { fontSize: 24, fontWeight: 800, margin: 0 },
  role: { margin: "2px 0 0", fontSize: 14, color: "#64748b" },
  p: { margin: "12px 0", color: "#374151" },
  cta: {
    marginTop: 14, display: "inline-block", padding: "12px 18px",
    borderRadius: 12, color: "#fff", fontWeight: 800,
    background: "linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(147,51,234,1) 100%)",
    boxShadow: "0 12px 20px rgba(79,70,229,.25)", textDecoration: "none",
  },
  plansIcon: {
    width: 64, height: 64, borderRadius: 14, display: "grid", placeItems: "center",
    background: "radial-gradient(120% 120% at 10% 0%, #a78bfa 0%, #7c3aed 100%)",
    color: "white", fontSize: 28, flexShrink: 0,
  },
  buttonDark: {
    display: "inline-block", padding: "10px 16px", borderRadius: 12,
    fontWeight: 800, color: "#fff", background: "#0f172a", textDecoration: "none",
  },
  features: {
    marginTop: 12, padding: "12px 14px", borderRadius: 12,
    background: "linear-gradient(180deg, rgba(255,255,255,1) 0%, rgba(241,245,249,1) 100%)",
    border: "1px solid rgba(148,163,184,.4)", color: "#334155", fontSize: 15,
  },
  chipsRow: { marginTop: 12, display: "flex", gap: 12, overflowX: "auto", paddingBottom: 6 },
  chip: {
    display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 14px",
    borderRadius: 14, background: "#fff", border: "1px solid rgba(148,163,184,.35)",
    boxShadow: "0 4px 10px rgba(2,8,23,.06)", whiteSpace: "nowrap",
  },
  chipIcon: {
    width: 36, height: 36, borderRadius: 10, display: "grid", placeItems: "center",
    background: "linear-gradient(180deg,#6366f1,#9333ea)", color: "#fff",
    fontWeight: 900, fontSize: 18, flexShrink: 0,
  },
  chipBadge: {
    padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 800,
    color: "#0f172a", background: "#f1f5f9", border: "1px solid rgba(15,23,42,.08)",
  },
  sectionHeader: { display: "flex", alignItems: "baseline", justifyContent: "space-between", marginTop: 12, marginBottom: 8 },
  link: { fontWeight: 800, color: "#4338ca", textDecoration: "none" },
};
