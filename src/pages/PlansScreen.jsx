import React, { useMemo, useState } from "react";

/**
 * PlansScreen — versão premium
 * - Detecta país (BR/US) a partir do locale do navegador
 * - Renderiza cartões com tipografia forte e ícones
 * - Botões GRANDES, acessíveis e com estados (hover/pressed/loading)
 * - Gratuito ativa plano local; pagos chamam a Function do Netlify: /.netlify/functions/checkout
 */

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
      id: "free",
      icon: "🌿",
      name: "Gratuito",
      price: "R$0/mês",
      features: [
        "10 mensagens/dia (GPT-4.0 mini)",
        "Ganhe mensagens extras assistindo anúncios"
      ],
      cta: "Começar grátis",
      btnClass: "btn btn-free",
      type: "free",
    },
    {
      id: "basic_br",
      icon: "🔹",
      name: "Básico",
      price: "R$14,90/mês",
      features: [
        "GPT-5 Nano (~275k tokens/dia)",
        "Acesso a todos os agentes",
        "Suporte básico",
      ],
      cta: "Assinar Básico",
      btnClass: "btn btn-basic",
      type: "paid",
      priceIdEnv: "VITE_PRICE_BASIC_BR", // defina no Netlify
    },
    {
      id: "inter_br",
      icon: "⚡",
      name: "Intermediário",
      price: "R$29,90/mês",
      features: [
        "GPT-4.1 Mini com voz (~410k tokens/dia)",
        "Todos os agentes liberados",
        "Bloqueio diário automático",
      ],
      cta: "Assinar Intermediário",
      btnClass: "btn btn-intermediate",
      type: "paid",
      priceIdEnv: "VITE_PRICE_INTER_BR",
    },
    {
      id: "prem_br",
      icon: "💎",
      name: "Premium",
      price: "R$90,00/mês",
      features: [
        "GPT-5 Standard + GPT-4.1 Mini",
        "~710k tokens/mês + ~1.2M tokens/dia",
        "Todos os agentes liberados",
        "Suporte prioritário",
      ],
      cta: "Assinar Premium",
      btnClass: "btn btn-premium",
      type: "paid",
      priceIdEnv: "VITE_PRICE_PREM_BR",
    },
  ],
  US: [
    {
      id: "free",
      icon: "🌿",
      name: "Free",
      price: "$0/mo",
      features: [
        "10 messages/day (GPT-4.0 mini)",
        "Earn extra messages watching ads",
      ],
      cta: "Start free",
      btnClass: "btn btn-free",
      type: "free",
    },
    {
      id: "basic_us",
      icon: "🔹",
      name: "Basic",
      price: "$2.99/mo",
      features: ["GPT-5 Nano", "All agents", "Basic support"],
      cta: "Subscribe Basic",
      btnClass: "btn btn-basic",
      type: "paid",
      priceIdEnv: "VITE_PRICE_BASIC_US",
    },
    {
      id: "inter_us",
      icon: "⚡",
      name: "Intermediate",
      price: "$4.99/mo",
      features: ["GPT-4.1 Mini (voice)", "All agents unlocked", "Auto daily lock"],
      cta: "Subscribe Intermediate",
      btnClass: "btn btn-intermediate",
      type: "paid",
      priceIdEnv: "VITE_PRICE_INTER_US",
    },
    {
      id: "prem_us",
      icon: "💎",
      name: "Premium",
      price: "$12.99/mo",
      features: [
        "GPT-5 Standard + GPT-4.1 Mini",
        "~710k tokens/mo + ~1.2M tokens/day",
        "All agents unlocked",
        "Priority support",
      ],
      cta: "Subscribe Premium",
      btnClass: "btn btn-premium",
      type: "paid",
      priceIdEnv: "VITE_PRICE_PREM_US",
    },
  ],
};

export default function PlansScreen() {
  const [loading, setLoading] = useState(null); // id do plano carregando
  const region = useMemo(detectRegion, []);
  const plans = PLANS[region] || PLANS.BR;

  const handleFree = () => {
    alert(region === "BR" ? "Plano Gratuito ativado!" : "Free plan activated!");
    // aqui você pode salvar no localStorage / Supabase se quiser
  };

  const startCheckout = async (plan) => {
    try {
      setLoading(plan.id);
      const priceId = import.meta.env[plan.priceIdEnv];

      if (!priceId) {
        alert("Preço não configurado. Defina as variáveis VITE_PRICE_* no Netlify.");
        return;
      }

      const res = await fetch("/.netlify/functions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, region }),
      });

      if (!res.ok) throw new Error("Checkout function error");

      const { url } = await res.json();
      if (!url) throw new Error("No URL returned");
      window.location.href = url;
    } catch (err) {
      console.error(err);
      alert("Erro ao iniciar checkout. Verifique sua configuração.");
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
        {plans.map((plan) => (
          <article key={plan.id} className="card plan-card" aria-label={`Plano ${plan.name}`}>
            <div className="plan-head">
              <div className="plan-icon" aria-hidden>{plan.icon}</div>
              <h2 className="plan-title">{plan.name}</h2>
              <div className="plan-price">{plan.price}</div>
            </div>

            <ul className="plan-features">
              {plan.features.map((f, i) => (
                <li key={i} className="feature">✔ {f}</li>
              ))}
            </ul>

            {plan.type === "free" ? (
              <button
                className={plan.btnClass}
                onClick={handleFree}
                aria-label={`${plan.cta} (plano gratuito)`}
              >
                {plan.cta}
              </button>
            ) : (
              <button
                className={plan.btnClass}
                onClick={() => startCheckout(plan)}
                disabled={loading === plan.id}
                aria-busy={loading === plan.id}
                aria-label={`${plan.cta} — ${plan.price}`}
              >
                {loading === plan.id ? "Redirecionando..." : plan.cta}
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
