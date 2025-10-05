import React from "react";
import { BRAND } from "../config/brand";

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
          Bem-vindo ao <span style={sx.brand}>{BRAND.lockup}</span>
        </h1>

        <p style={sx.sub}>
          Projetos de estudo com <strong>ABNT/APA</strong>, cronograma e{" "}
          <strong>fontes verificadas (Source-Proof)</strong> — orquestrados
          pelo motor <strong>{BRAND.engine}</strong>. {BRAND.claim}
        </p>
      </header>

      {/* Serginho (orquestrador) */}
      <section style={sx.card} aria-labelledby="serginho-title">
        <div style={sx.row}>
          <img
            src="/serginho.svg"
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

          <span style={sx.badgeFree} aria-label="Disponível em todos os planos">
            Livre
          </span>
        </div>

        <p style={sx.p}>
          Agente especial e generalista. Orquestra os especialistas, supervisiona
          e articula todas as interações para resolver qualquer tarefa — com foco
          supremo em <strong>estudo</strong>.
        </p>

        <a
          href="/agents"
          style={sx.cta}
          aria-label="Explorar especialistas (com Serginho)"
        >
          Explorar Especialistas (Premium)
        </a>
      </section>

      {/* preview dos especialistas */}
      <div style={sx.sectionHeader}>
        <h3 style={sx.h3}>Especialistas (preview)</h3>
        <a href="/agents" style={sx.link} aria-label="Ver todos os especialistas">
          Ver todos os 12
        </a>
      </div>

      <div style={sx.chipsRow} role="list" aria-label="Especialistas em destaque">
        {[
          { id: "emo", name: "Emo", icon: "💜" },
          { id: "didak", name: "Didak", icon: "📚" },
          { id: "code", name: "Code", icon: "💻" },
          { id: "focus", name: "Focus", icon: "🎯" },
          { id: "bizu", name: "Bizu", icon: "🧠" },
          { id: "orac", name: "Orac", icon: "🔮" },
        ].map((it) => (
          <div key={it.id} style={sx.chip} role="listitem" aria-label={it.name}>
            <div aria-hidden style={sx.chipIcon}>{it.icon}</div>
            <div style={{ fontWeight: 800 }}>{it.name}</div>
            <span style={sx.chipBadge}>Premium</span>
          </div>
        ))}
      </div>

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

        <a href="/pricing" style={sx.buttonDark} aria-label="Ver planos">
          Ver planos
        </a>

        <div style={sx.features} aria-label="Benefícios">
          • SSL/TLS automático
          <br />• Checkout Stripe
          <br />• PWA Android/iOS
          <br />• 12 Especialistas + Orquestrador
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
  badgeFree: {
    marginLeft: "auto",
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 800,
    color: "#15803d",
    background: "rgba(34,197,94,.12)",
    border: "1px solid rgba(21,128,61,.25)",
    backdropFilter: "blur(2px)"
  },
  h2: { fontSize: 24, fontWeight: 900, margin: 0 },
  h3: { margin: "18px 0 6px", fontSize: 18, fontWeight: 900, color: tone.ink2 },
  role: { margin: "2px 0 0", fontSize: 14, color: tone.soft },
  p: { margin: "12px 0", color: "#374151" },

  cta: {
    marginTop: 14,
    display: "inline-block",
    padding: "12px 18px",
    borderRadius: 12,
    color: "#fff",
    fontWeight: 900,
    background: tone.grad,
    boxShadow: "0 12px 20px rgba(79,70,229,.25)",
    textDecoration: "none"
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
    padding: "10px 16px",
    borderRadius: 12,
    fontWeight: 900,
    color: "#fff",
    background: "#0f172a",
    textDecoration: "none",
    marginTop: 2
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
