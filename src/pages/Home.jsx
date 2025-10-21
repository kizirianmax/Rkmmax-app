import React from "react";
import { BRAND } from "../config/brand.js";

/**
 * Home — RKMMAX Infinity Matrix/Study
 * - Hero com a marca do BRAND.lockup
 * - Card do Serginho + CTA para /agents
 * - Preview dos especialistas + link
 * - Card de Planos + CTA para /pricing
 * - Estilos inline leves (sem dependências)
 */

export default function Home() {
  return (
    <main style={sx.page} role="main" aria-label="Página inicial">
      {/* Header / Hero */}
      <header style={sx.hero} aria-labelledby="hero-title">
        <h1 id="hero-title" style={sx.title}>
          Serginho e sua equipe de especialistas transformam o impossível em realidade
        </h1>

        <p style={sx.sub}>
          <strong>Serginho + Especialistas.</strong> E, quando precisar, o{" "}
          <strong>Study Lab</strong> (opcional) para estudo acelerado.
        </p>
      </header>

      {/* Serginho (orquestrador) */}
      <section style={sx.card} aria-labelledby="serginho-title">
        <div style={sx.row}>
          <img
            src="/avatars/serginho.png"
            alt="Avatar do Serginho (Orquestrador)"
            width={64}
            height={64}
            loading="lazy"
            decoding="async"
            style={sx.sergImg}
          />

          <div>
            <h2 id="serginho-title" style={sx.h2}>Serginho</h2>
            <p style={sx.role}>Orquestrador</p>
          </div>

          <span style={sx.badgePWA} aria-label="Disponível como aplicativo">
            ✨ APP
          </span>
        </div>

        <p style={sx.p}>
          Agente especial e generalista. Orquestra os especialistas, supervisiona
          e articula todas as interações para resolver <strong>qualquer tarefa</strong>.
        </p>

        <div style={{ display: "flex", gap: "10px", flexDirection: "column", marginTop: 16 }}>
          <a
            href="/serginho"
            style={sx.ctaBlue}
            role="button"
            aria-label="Falar com o Serginho"
          >
            🤖 Falar com o Serginho
          </a>
          <a
            href="/specialists"
            style={sx.ctaPurple}
            role="button"
            aria-label="Explorar Especialistas"
          >
            👥 Explorar Especialistas
          </a>
          <a
            href="/study"
            style={sx.ctaGreen}
            role="button"
            aria-label="Abrir Study Lab"
          >
            📚 Abrir Study Lab
          </a>
          <a
            href="/pricing"
            style={sx.ctaOrange}
            role="button"
            aria-label="Ver Planos"
          >
            💳 Ver Planos
          </a>
        </div>
      </section>

      {/* Planos */}
      <section style={sx.card} aria-labelledby="plans-title">
        <div style={sx.row}>
          <div style={sx.plansIcon} aria-hidden>💳</div>
          <div>
            <h2 id="plans-title" style={sx.h2}>Planos</h2>
            <p style={sx.role}>Assine com segurança (Stripe)</p>
          </div>
        </div>

        <p style={sx.p}>
          Planos claros, pagamento via Stripe e acesso imediato ao app.
          Suporte e upgrades simples para crescer junto com você.
        </p>



        <div style={sx.features} aria-label="Benefícios">
          • SSL/TLS automático
          <br />• Checkout Stripe
          <br />• PWA Android/iOS
          <br />• 54 Especialistas + Serginho Infinito
        </div>
      </section>

      <footer style={sx.footer}>
        <small style={sx.muted}>
          © {new Date().getFullYear()} {BRAND.master} — {BRAND.vertical}
        </small>
      </footer>
    </main>
  );
}

/* ─── design tokens / estilos ─── */

const tone = {
  ink: "#0f172a",
  ink2: "#111827",
  mute: "#334155",
  soft: "#64748b",
  line: "rgba(148,163,184,.35)",
  bgCard: "#ffffff",
  grad: "linear-gradient(90deg, rgba(59,130,246,1) 0%, rgba(79,70,229,1) 100%)",
  chipGrad: "linear-gradient(180deg,#6366f1,#9333ea)",
  heartGrad: "radial-gradient(120% 120% at 10% 0%, #ec4899, #8b5cf6)"
};

const sx = {
  page: {
    maxWidth: 1120,
    margin: "0 auto",
    padding: "28px 16px 56px",
    paddingBottom: "96px", // Espaço para botão flutuante no mobile
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    color: tone.ink,
    lineHeight: 1.45
  },
  hero: { marginBottom: 12 },
  title: {
    fontSize: 36,
    fontWeight: 900,
    letterSpacing: -0.5,
    margin: "0 0 10px"
  },
  brand: {
    background: tone.grad,
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent"
  },
  sub: { margin: "0 0 24px", fontSize: 18, color: tone.mute },

  card: {
    background: tone.bgCard,
    borderRadius: 16,
    padding: 20,
    boxShadow: "0 10px 20px rgba(2,8,23,.06), 0 2px 6px rgba(2,8,23,.04)",
    marginBottom: 16
  },
  row: { display: "flex", gap: 16, alignItems: "center" },
  sergImg: {
    width: 64,
    height: 64,
    borderRadius: 14,
    objectFit: "cover",
    background: "linear-gradient(180deg, #0ea5e9, #8b5cf6)",
    boxShadow: "inset 0 0 3px rgba(255,255,255,.6)",
    flexShrink: 0
  },
  badgePWA: {
    marginLeft: "auto",
    padding: "6px 14px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    color: "#fff",
    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 50%, #f59e0b 100%)",
    boxShadow: "0 4px 12px rgba(139,92,246,.35), 0 2px 6px rgba(236,72,153,.25)",
    backdropFilter: "blur(2px)",
    letterSpacing: "1px"
  },
  h2: { fontSize: 24, fontWeight: 900, margin: 0 },
  h3: { margin: "18px 0 6px", fontSize: 18, fontWeight: 900, color: tone.ink2 },
  role: { margin: "2px 0 0", fontSize: 14, color: tone.soft },
  p: { margin: "12px 0", color: "#374151" },

  ctaBlue: {
    display: "block",
    padding: "12px 20px",
    textAlign: "center",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
    boxShadow: "0 4px 12px rgba(59,130,246,.3)",
    textDecoration: "none",
    touchAction: "manipulation"
  },
  ctaPurple: {
    display: "block",
    padding: "12px 20px",
    textAlign: "center",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    background: "linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)",
    boxShadow: "0 4px 12px rgba(139,92,246,.3)",
    textDecoration: "none",
    touchAction: "manipulation"
  },
  ctaGreen: {
    display: "block",
    padding: "12px 20px",
    textAlign: "center",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    boxShadow: "0 4px 12px rgba(16,185,129,.3)",
    textDecoration: "none",
    touchAction: "manipulation"
  },
  ctaOrange: {
    display: "block",
    padding: "12px 20px",
    textAlign: "center",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 700,
    fontSize: 15,
    background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    boxShadow: "0 4px 12px rgba(245,158,11,.3)",
    textDecoration: "none",
    touchAction: "manipulation"
  },

  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 8
  },
  link: { fontWeight: 900, color: "#4338ca", textDecoration: "none" },

  chipsRow: {
    marginTop: 12,
    display: "flex",
    gap: 12,
    overflowX: "auto",
    paddingBottom: 6
  },
  chip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    borderRadius: 14,
    background: "#fff",
    border: `1px solid ${tone.line}`,
    boxShadow: "0 4px 10px rgba(2,8,23,.06)",
    whiteSpace: "nowrap",
    outline: "none"
  },
  chipIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    background: tone.chipGrad,
    color: "#fff",
    fontWeight: 900,
    fontSize: 18,
    flexShrink: 0
  },
  chipBadge: {
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    color: tone.ink2,
    background: "#f1f5f9",
    border: `1px solid ${tone.line}`
  },

  plansIcon: {
    width: 64,
    height: 64,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: tone.heartGrad,
    color: "#fff",
    fontSize: 28,
    flexShrink: 0
  },
  buttonDark: {
    display: "inline-block",
    padding: "12px 20px",
    minHeight: 48,
    borderRadius: 16,
    fontWeight: 900,
    fontSize: 16,
    color: "#fff",
    background: "#0f172a",
    textDecoration: "none",
    marginTop: 2,
    touchAction: "manipulation"
  },
  features: {
    marginTop: 12,
    padding: "12px 14px",
    borderRadius: 12,
    background: "linear-gradient(180deg, rgba(255,255,255,.65), rgba(255,255,255,.95))",
    border: `1px solid ${tone.line}`,
    color: tone.mute,
    fontSize: 15
  },

  footer: { marginTop: 24, textAlign: "center" },
  muted: { color: tone.soft }
};
