// --- PlansScreen.jsx ---
// Mapeamento dos preços no Stripe por moeda/país
const PLANS = {
  BRL: [
    {
      tier: "Básico",
      priceLabel: "R$ 14,90/mês",
      priceKey: "price_1S3RNLENxIkCT0yfu3UlZ7gM", // BR - Basic
    },
    {
      tier: "Intermediário",
      priceLabel: "R$ 29,90/mês",
      priceKey: "price_1S3RPwENxIkCT0yfGUL2ae8N", // BR - Intermediate
    },
    {
      tier: "Premium",
      priceLabel: "R$ 49,00/mês",
      priceKey: "price_1S3RSCENxIkCT0yf1pE1yLIQ", // BR - Premium
    },
  ],
  USD: [
    {
      tier: "Basic",
      priceLabel: "$ 10.00 / month",
      priceKey: "price_1S4XDMENxIkCT0yfyply90w", // US - Basic
    },
    {
      tier: "Intermediate",
      priceLabel: "$ 25.00 / month",
      priceKey: "price_1S3RZGENxIkCT0yf1L0jV8Ns", // US - Intermediate
    },
    {
      tier: "Premium",
      priceLabel: "$ 30.00 / month",
      priceKey: "price_1S4XSRENxIkCT0yf17FK5R9Y", // US - Premium
    },
  ],
};

// Exemplo de função de checkout já utilizando o priceKey
async function startCheckout(priceKey) {
  try {
    const res = await fetch("/.netlify/functions/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceKey }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Erro desconhecido");

    // Redireciona para o Stripe Checkout
    window.location.href = data.url;
  } catch (err) {
    alert(`Erro ao iniciar checkout: ${err.message || "desconhecido"}`);
  }
}

// …no JSX dos seus cards, use algo assim:
// {PLANS.BRL.map(plan => (
//   <button onClick={() => startCheckout(plan.priceKey)}>Assinar</button>
// ))}
