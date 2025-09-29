import React from "react";

// Lista de planos (BR e US) com recursos detalhados
const PLANS = [
  {
    name: "RKMMAX Básico – BR",
    price: "R$ 14,90/mês",
    link: "https://buy.stripe.com/14A00jd7pe6h681Bvn3oA08",
    description:
      "Funções essenciais com limite inteligente de conversa para começar.",
    features: [
      "Atendimento via Serginho com GPT‑4.1 Mini",
      "Streaming de voz (TTS) para respostas em áudio",
      "PWA Android/iOS (funciona como app, offline e rápido)",
      "12 especialistas disponíveis para consultas via Serginho",
      "Checkout Stripe seguro com cobrança em Reais"
    ]
  },
  {
    name: "RKMMAX Básico – US",
    price: "US$ 10/mês",
    link: "https://buy.stripe.com/00w14naZh0fR1S51UN3oA09",
    description: "Essential functions, smart conversation limits and starter support.",
    features: [
      "Access via Serginho using GPT‑4.1 Mini",
      "TTS audio replies",
      "PWA (Android/iOS) support",
      "12 specialists available (via Serginho)",
      "Secure Stripe checkout with USD pricing"
    ]
  },
  {
    name: "RKMMAX Intermediário – BR",
    price: "R$ 50,00/mês",
    link: "https://buy.stripe.com/7sY14nffxfaL2W9dDv3oA0a",
    description:
      "Funções avançadas com voz, maior limite de tokens e suporte ampliado.",
    features: [
      "GPT‑4.1 Mini + GPT‑4.1 Standard (alternado via Serginho)",
      "Maior limite diário de tokens para conversas longas",
      "Streaming de voz (Whisper + TTS)",
      "PWA com suporte offline",
      "12 especialistas liberados no modo Premium",
      "Checkout Stripe seguro em Reais"
    ]
  },
  {
    name: "RKMMAX Intermediate – US",
    price: "US$ 20/mês",
    link: "https://buy.stripe.com/5kQ7sL4AtauV9kx2YR3oA0d",
    description:
      "Advanced features, voice (Whisper + TTS), higher daily token usage.",
    features: [
      "GPT‑4.1 Mini + Standard (via Serginho)",
      "High daily token allowance",
      "Whisper + TTS audio streaming",
      "PWA offline support",
      "12 specialists available in Premium plan",
      "Secure Stripe checkout in USD"
    ]
  },
  {
    name: "RKMMAX Premium – BR",
    price: "R$ 90,00/mês",
    link: "https://buy.stripe.com/00w6oHazhfalcwJcZT30A0c",
    description:
      "Acesso total: GPT‑5 Standard + GPT‑4.1 Mini, limites ampliados e prioridade máxima.",
    features: [
      "GPT‑5 Standard + GPT‑4.1 Mini ilimitado",
      "Limites diários/mensais ampliados",
      "Acesso direto aos 12 especialistas (sem passar pelo Serginho)",
      "Suporte prioritário 24h",
      "PWA Android/iOS com push notifications",
      "Checkout Stripe seguro em Reais"
    ]
  },
  {
    name: "RKMMAX Premium – US",
    price: "US$ 30/mês",
    link: "https://buy.stripe.com/5kQaEXfFx4w71559mK3oA0e",
    description:
      "Full access: GPT‑5 Standard + GPT‑4.1 Mini, expanded limits and top priority.",
    features: [
      "GPT‑5 Standard + GPT‑4.1 Mini (unlimited)",
      "Expanded daily and monthly limits",
      "Direct access to 12 specialists (no Serginho mediation)",
      "24h priority support",
      "PWA Android/iOS with push notifications",
      "Secure Stripe checkout in USD"
    ]
  }
];

// Perguntas frequentes em português
const FAQS = [
  {
    question: "Como funciona o pagamento?",
    answer:
      "O pagamento é processado via Stripe, fornecendo checkout seguro com SSL/TLS e proteção anti-fraude. Aceitamos cartões nacionais e internacionais."
  },
  {
    question: "Posso cancelar ou mudar de plano quando quiser?",
    answer:
      "Sim. Você pode cancelar a assinatura ou migrar de plano a qualquer momento diretamente pelo painel ou entrando em contato com nosso suporte."
  },
  {
    question: "Qual a diferença entre Serginho e os especialistas?",
    answer:
      "Serginho é o orquestrador geral, que coordena as interações. Os especialistas são agentes focados em áreas específicas, liberados completamente apenas no plano Premium."
  },
  {
    question: "O que é PWA e por que isso importa?",
    answer:
      "PWA (Progressive Web App) permite que você use o RKMMAX como um aplicativo nativo no seu dispositivo, com carregamento rápido, funcionamento offline e notificações push."
  },
  {
    question: "Quais modelos de IA estão disponíveis?",
    answer:
      "Dependendo do plano, você terá acesso ao GPT‑4.1 Mini, GPT‑4.1 Standard ou GPT‑5 Standard, além de capacidades de voz (Whisper + TTS)."
  }
];

export default function Pricing() {
  return (
    <main className="min-h-screen bg-white text-gray-900 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-4 text-center">
          Planos RKMMAX
        </h1>
        <p className="text-lg text-center mb-12">
          Escolha o plano que melhor atende sua empresa e tenha a melhor IA do
          mercado com checkout seguro via Stripe e acesso aos nossos 12
          especialistas.
        </p>

        {/* Cards de planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLANS.map((plan, idx) => {
            const enabled = Boolean(plan.link && plan.link.startsWith("http"));
            return (
              <div
                key={idx}
                className="border rounded-2xl shadow-lg p-6 flex flex-col"
              >
                <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
                <p className="text-lg text-cyan-600 font-semibold mb-2">
                  {plan.price}
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  {plan.description}
                </p>
                <ul className="list-disc pl-5 mb-6 space-y-2 text-gray-700">
                  {plan.features.map((feature, i) => (
                    <li key={i}>{feature}</li>
                  ))}
                </ul>
                {enabled ? (
                  <a
                    href={plan.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto inline-block w-full text-center bg-cyan-500 hover:bg-cyan-600 transition text-white font-bold py-2 px-4 rounded-xl"
                  >
                    Assinar
                  </a>
                ) : (
                  <button
                    disabled
                    className="mt-auto inline-block w-full text-center bg-gray-300 text-gray-600 font-bold py-2 px-4 rounded-xl cursor-not-allowed"
                    onClick={() =>
                      alert("Link de pagamento ainda não configurado.")
                    }
                  >
                    Indisponível
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Perguntas frequentes
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b pb-4">
                <h3 className="font-semibold text-lg mb-1">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
