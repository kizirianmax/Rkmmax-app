// src/pages/Pricing.jsx
import React from "react";

/**
 * Detecta ambiente (funciona com Vite, CRA e Node).
 * Em dev: import.meta.env.MODE === "development"
 * Em prod: "production"
 */
const metaEnv =
  typeof import !== "undefined" && import.meta && import.meta.env
    ? import.meta.env
    : {};
const isProd =
  metaEnv.MODE === "production" || process.env.NODE_ENV === "production";

/**
 * Cole aqui seus Payment Links do Stripe.
 * - Em desenvolvimento, use os links que começam com /test_
 * - Em produção, use os links live (sem /test_)
 */
const LINKS = {
  test: {
    // ✅ seu link de teste do plano Básico:
    basic: "https://buy.stripe.com/test_14AbJ15EXbYz1S5bvn3oA01",
    // Deixe vazio por enquanto (os botões ficam desabilitados):
    inter: "",
    prem: "",
  },
  live: {
    // 🔜 quando criar os links live (modo produção), cole aqui:
    basic: "https://buy.stripe.com/xxxBASICO",
    inter: "https://buy.stripe.com/xxxINTER",
    prem:  "https://buy.stripe.com/xxxPREM",
  },
};
const getLink = (key) => (isProd ? LINKS.live[key] : LINKS.test[key]) || "";

/**
 * Planos — ajuste textos/benefícios à vontade.
 */
const PLANS = [
  {
    key: "basic",
    name: "RKM MAX Básico",
    price: "R$ 14,90/mês",
    description: "Funções essenciais e limite inicial diário.",
    features: ["Essenciais ilimitados", "Limite diário de tokens", "Suporte inicial"],
    link: getLink("basic"),
  },
  {
    key: "inter",
    name: "RKM MAX Intermediário",
    price: "R$ 50,00/mês",
    description: "Funções avançadas, voz (Whisper + TTS) e limites maiores.",
    features: ["Tudo do Básico", "Mais tokens/dia", "Whisper + TTS", "Suporte prioritário"],
    link: getLink("inter"),
  },
  {
    key: "prem",
    name: "RKM MAX Premium",
    price: "R$ 90,00/mês",
    description: "Acesso total, priorização máxima e todos os especialistas.",
    features: ["Tudo do Intermediário", "GPT-5 + 4.1 Mini", "12 especialistas + Orquestrador", "Suporte 24/7"],
    link: getLink("prem"),
    highlight: true,
  },
];

/**
 * Cartão de plano
 */
function PlanCard({ plan }) {
  const enabled = Boolean(plan.link);

  return (
    <article
      className={[
        "flex flex-col rounded-2xl p-6 border shadow-xl transition-all",
        plan.highlight
          ? "bg-gradient-to-b from-indigo-600/10 via-violet-600/10 to-fuchsia-600/10 border-indigo-500/30"
          : "bg-gray-900 border-cyan-800/30",
      ].join(" ")}
      aria-label={`Plano ${plan.name}`}
    >
      <header className="mb-4">
        <h2 className="text-2xl font-extrabold tracking-tight text-white">{plan.name}</h2>
        <p className="text-cyan-300 text-lg mt-1">{plan.price}</p>
        <p className="text-gray-300 text-sm mt-1">{plan.description}</p>
      </header>

      <ul className="text-gray-300 text-sm list-disc pl-5 space-y-2 mb-6">
        {plan.features.map((feat, i) => (
          <li key={i}>{feat}</li>
        ))}
      </ul>

      {enabled ? (
        <a
          href={plan.link}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            "inline-flex items-center justify-center rounded-xl font-extrabold py-3 px-5",
            "bg-cyan-400 text-black hover:bg-cyan-300 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-300"
          ].join(" ")}
          aria-label={`Assinar ${plan.name} por ${plan.price}`}
        >
          Assinar
        </a>
      ) : (
        <button
          disabled
          className="inline-flex items-center justify-center rounded-xl font-extrabold py-3 px-5 bg-gray-700 text-gray-300 cursor-not-allowed"
          title="Link de checkout indisponível"
        >
          Indisponível
        </button>
      )}
    </article>
  );
}

/**
 * Página de preços
 */
export default function Pricing() {
  return (
    <main className="min-h-screen bg-gray-950 text-white">
      <section className="w-full max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Planos RKMMAX</h1>
          <span
            className={[
              "ml-auto inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ring-1",
              isProd ? "bg-emerald-600/20 text-emerald-300 ring-emerald-600/40" : "bg-amber-600/20 text-amber-300 ring-amber-600/40",
            ].join(" ")}
            title={isProd ? "Ambiente de Produção" : "Ambiente de Teste"}
          >
            {isProd ? "PRODUÇÃO" : "TESTE"}
          </span>
        </div>

        {!isProd && (
          <div className="mb-6 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-200 px-4 py-3 text-sm">
            Modo de <strong>teste</strong> ativo. Use links do Stripe que começam com <code>/test_</code>.
            Em produção, troque por links <em>live</em> no topo deste arquivo.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {PLANS.map((plan) => (
            <PlanCard key={plan.key} plan={plan} />
          ))}
        </div>

        <p className="text-gray-400 text-xs mt-8">
          Pagamentos processados com segurança pela Stripe. Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
        </p>
      </section>
    </main>
  );
}
