// src/pages/Pricing.jsx
import React from "react";

const PLANS = [
  {
    name: "RKMMAX Básico – BR",
    price: "R$ 14,90/mês",
    link: "https://buy.stripe.com/14A00jd7pe6h681Bvn3oA08",
    description: "Funções essenciais, limite inteligente de conversas e suporte inicial."
  },
  {
    name: "RKMMAX Básico – US",
    price: "US$ 10/mês",
    link: "https://buy.stripe.com/00w14naZh0fR1S51UN3oA09",
    description: "Essential functions, smart conversation limits, and starter support."
  },
  {
    name: "RKMMAX Intermediário – BR",
    price: "R$ 50,00/mês",
    link: "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0a",
    description: "Funções avançadas, voz (Whisper + TTS) e maior limite diário de tokens."
  },
  {
    name: "RKMMAX Intermediate – US",
    price: "US$ 20/mês",
    link: "https://buy.stripe.com/5kQ7sL4AtauV9kx2YR3oA0d",
    description: "Advanced features, voice (Whisper + TTS), higher daily token usage."
  },
  {
    name: "RKMMAX Premium – BR",
    price: "R$ 90,00/mês",
    link: "https://buy.stripe.com/00w6oHazhfalcwJcZT30A0c",
    description: "Acesso total: GPT-5 Standard + GPT-4.1 Mini, limites ampliados e prioridade máxima."
  },
  {
    name: "RKMMAX Premium – US",
    price: "US$ 30/mês",
    link: "https://buy.stripe.com/5kQaEXfFx4w71559nf30Ae",
    description: "Full access: GPT-5 Standard + GPT-4.1 Mini, expanded limits and top priority."
  }
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center p-8">
      <h1 className="text-4xl font-bold mb-8 text-cyan-400">Planos RKMMAX</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {PLANS.map((plan, index) => {
          const enabled = Boolean(plan.link && plan.link.startsWith("http"));
          return (
            <div
              key={index}
              className="bg-gray-900 border border-cyan-500 rounded-2xl shadow-lg p-6 flex flex-col items-center"
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-lg text-cyan-300 mb-4">{plan.price}</p>
              <p className="text-sm text-gray-300 text-center mb-6">{plan.description}</p>
              {enabled ? (
                <a
                  href={plan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-cyan-500 text-black font-bold rounded-xl hover:bg-cyan-400 transition"
                >
                  Assinar
                </a>
              ) : (
                <button
                  disabled
                  className="px-6 py-2 bg-gray-600 text-gray-300 font-bold rounded-xl cursor-not-allowed"
                  onClick={() => alert("Link de pagamento ainda não configurado.")}
                >
                  Indisponível
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
