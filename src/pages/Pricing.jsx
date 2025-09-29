// src/pages/Pricing.jsx
import React from "react";

// Lista de planos com detalhes e benefícios
const PLANS = [
  {
    name: "RKMMAX Básico",
    price: "R$ 14,90/mês",
    link: "https://buy.stripe.com/14A00jd7pe6h681Bvn3oA08",
    description: "Funções essenciais, limite inteligente de conversas e suporte inicial.",
    features: [
      "Essenciais ilimitados (conversa básica com Serginho)",
      "Limite diário de tokens para uso da IA",
      "Suporte inicial via e-mail",
    ],
  },
  {
    name: "RKMMAX Intermediário",
    price: "R$ 50,00/mês",
    link: "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0",
    description: "Funções avançadas, voz (Whisper + TTS) e maior limite diário de tokens.",
    features: [
      "Tudo do plano Básico",
      "Limite maior de tokens diários",
      "Funcionalidade de voz (Whisper + TTS)",
      "Suporte prioritário via chat",
    ],
  },
  {
    name: "RKMMAX Premium",
    price: "R$ 90,00/mês",
    link: "https://buy.stripe.com/00w6oHazhfalcwJcZT30Ao3c",
    description: "Acesso total: GPT‑5, GPT-4.1 Mini, limites ampliados e prioridade máxima.",
    features: [
      "Tudo do plano Intermediário",
      "Acesso a GPT‑5 Standard e GPT‑4.1 Mini",
      "Limites e prioridade máximos",
      "Acesso aos 12 especialistas + Orquestrador",
      "Suporte via chat 24/7",
    ],
  },
];

// Componente de cartão de plano
function PlanCard({ plan }) {
  const enabled = Boolean(plan.link);
  return (
    <div className="flex flex-col p-6 rounded-2xl shadow-lg bg-gray-900 border border-cyan-800 mb-8">
      <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
      <p className="text-lg text-cyan-300 mb-4">{plan.price}</p>
      <p className="text-sm text-gray-300 mb-4">{plan.description}</p>
      <ul className="text-gray-300 text-sm list-disc pl-4 space-y-2 mb-6">
        {plan.features.map((feat, idx) => (
          <li key={idx}>{feat}</li>
        ))}
      </ul>
      {enabled ? (
        <a
          href={plan.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-cyan-500 text-black font-bold py-2 px-6 rounded-xl hover:bg-cyan-400 transition-colors"
        >
          Assinar
        </a>
      ) : (
        <button
          disabled
          className="inline-block bg-gray-600 text-gray-300 font-bold py-2 px-6 rounded-xl cursor-not-allowed"
        >
          Indisponível
        </button>
      )}
    </div>
  );
}

// Página de planos
export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8">Planos RKMMAX</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {PLANS.map((plan, index) => (
          <PlanCard key={index} plan={plan} />
        ))}
      </div>
    </div>
  );
}
