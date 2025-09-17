import React, { useMemo, useState } from "react";

const detectRegion = () => {
  try {
    const locale = Intl.DateTimeFormat().resolvedOptions().locale || "pt-BR";
    return locale.toLowerCase().includes("pt") || locale.toLowerCase().includes("br") ? "BR" : "US";
  } catch {
    return "BR";
  }
};

const PLANS = {
  BR: [
    {
      planKey: "free",
      icon: "🌿",
      name: "Gratuito",
      price: "R$0/mês",
      features: [
        "10 mensagens/dia (GPT-4.0 mini)",
        "Ganhe mensagens extras assistindo anúncios",
      ],
      cta: "Começar grátis",
      btnClass: "btn btn-free",
      type: "free",
    },
    {
      planKey: "basic_br",
      icon: "🔹",
      name: "Básico",
      price: "R$14,90/mês",
      features: ["GPT-5 Nano (~275k tokens/dia)", "Acesso a todos os agentes", "Suporte básico"],
      cta: "Assinar Básico",
      btnClass: "btn btn-basic",
      type: "paid",
    },
    {
      planKey: "inter_br",
      icon: "⚡",
      name: "Intermediário",
      price: "R$29,90/mês",
      features: ["GPT-4.1 Mini com voz (~410k tokens/dia)", "Todos os agentes liberados", "Bloqueio diário automático"],
      cta: "Assinar Intermediário",
      btnClass: "btn btn-intermediate",
      type: "paid",
    },
    {
      planKey: "prem_br",
      icon: "💎",
      name: "Premium",
      price: "R$90,00/mês",
      features: ["GPT-5 Standard + GPT-4.1 Mini", "~710k tokens/mês + ~1.2M tokens/dia", "Todos os agentes liberados", "Suporte prioritário"],
      cta: "Assinar Premium",
      btnClass: "btn btn-premium",
      type: "paid",
    },
  ],
  US: [
    { planKey: "free", icon: "🌿", name: "Free", price: "$0/mo", features: ["10 messages/day (GPT-4.0 mini)", "Earn extra messages watching ads"], cta: "Start free", btnClass: "btn btn-free", type: "free" },
    { planKey: "basic_us", icon: "🔹", name: "Basic", price: "$2.99/mo", features: ["GPT-5 Nano", "All agents", "Basic support"], cta: "Subscribe Basic", btnClass: "btn btn-basic", type: "paid" },
    { planKey: "inter_us", icon: "⚡", name: "Intermediate", price: "$4.99/mo", features: ["GPT-4.1 Mini (voice)", "All agents unlocked", "Auto daily lock"], cta: "Subscribe Intermediate", btnClass: "btn btn-intermediate", type: "paid" },
    { planKey: "prem_us", icon: "💎", name: "Premium", price: "$12.99/mo", features: ["GPT-5 Standard + GPT-4.1 Mini", "~710k tokens/mo + ~1.2M tokens/day", "All agents unlocked", "Priority support"], cta: "Subscribe Premium", btnClass: "btn btn-premium", type: "paid" },
  ],
};

export default function PlansScreen() {
  const [loading, setLoading] = useState(null);
  const region = useMemo(detectRegion, []);
  const plans = PLANS[region] || PLANS.BR;

  const handleFree = () => {
    alert(region === "BR" ? "Plano Gratuito ativado!" : "Free plan activated!");
    // opcional: salvar preferência no Supabase/localStorage aqui
  };

  const startCheckout = async (planKey) => {
    try {
      setLoading(planKey);
      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planKey, region }),
      });
      if (!res.ok) throw new Error("Checkout function error");
      const { url } = await res.json();
      if (!url) throw new Error("No URL returned");
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar checkout. Verifique sua configuração do Stripe/Netlify.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <main className="container">
      <header className="section-header">
        <h1 className="title-xl">Escolha seu Plano <span className="brand">RKMMax</span> 🚀</h1>
        <p className="muted">Região detectada: <strong>{region}</strong></p>
      </header>

      <section className="plans-grid">
        {plans.map((p) => (
          <article key={p.planKey} className="card plan-card" aria-label={`Plano ${p.name}`}>
            <div className="plan-head">
              <div className="plan-icon" aria-hidden>{p.icon}</div>
              <h2 className="plan-title">{p.name}</h2>
              <div className="plan-price">{p.price}</div>
            </div>

            <ul className="plan-features">
              {p.features.map((f, i) => <li key={i} className="feature">✔ {f}</li>)}
            </ul>

            {p.type === "free" ? (
              <button className={p.btnClass} onClick={handleFree} aria-label={`${p.cta} (plano gratuito)`}>
                {p.cta}
              </button>
            ) : (
              <button
                className={p.btnClass}
                onClick={() => startCheckout(p.planKey)}
                disabled={loading === p.planKey}
                aria-busy={loading === p.planKey}
                aria-label={`${p.cta} — ${p.price}`}
              >
                {loading === p.planKey ? "Redirecionando..." : p.cta}
              </button>
            )}
          </article>
        ))}
      </section>

      <footer className="section-footer">
        <small className="muted">© {new Date().getFullYear()} RKMMax — todos os direitos reservados.</small>
      </footer>
    </main>
  );
}
