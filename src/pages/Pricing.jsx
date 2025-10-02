// no topo do Pricing.jsx
const isProd = import.meta.env.MODE === "production";

const LINKS = {
  test: {
    basic: "https://buy.stripe.com/test_xxxBASICO",
    inter: "https://buy.stripe.com/test_xxxINTER",
    prem:  "https://buy.stripe.com/test_xxxPREM",
  },
  live: {
    basic: "https://buy.stripe.com/xxxBASICO",
    inter: "https://buy.stripe.com/xxxINTER",
    prem:  "https://buy.stripe.com/xxxPREM",
  }
};

const PLANS = [
  {
    name: "RKM MAX Básico",
    price: "R$ 14,90/mês",
    link: isProd ? LINKS.live.basic : LINKS.test.basic,
    description: "Funções essenciais, limite inicial diário.",
    features: ["Essenciais ilimitados", "Limite diário de tokens", "Suporte inicial"],
  },
  {
    name: "RKM MAX Intermediário",
    price: "R$ 50,00/mês",
    link: isProd ? LINKS.live.inter : LINKS.test.inter,
    description: "Funções avançadas, voz, limites maiores.",
    features: ["Tudo do Básico", "Mais tokens/dia", "Whisper + TTS", "Suporte prioritário"],
  },
  {
    name: "RKM MAX Premium",
    price: "R$ 90,00/mês",
    link: isProd ? LINKS.live.prem : LINKS.test.prem,
    description: "Acesso total e prioridade máxima.",
    features: ["Tudo do Intermediário", "GPT-5 + 4.1 Mini", "12 especialistas + Orquestrador", "Suporte 24/7"],
  },
];
