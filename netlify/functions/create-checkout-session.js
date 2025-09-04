// netlify/functions/create-checkout-session.js
// Serverless function (Netlify) para criar uma sessão de checkout no Stripe

const stripeSecret = process.env.STRIPE_SECRET_KEY;
let stripe = null;
if (stripeSecret) {
  stripe = require("stripe")(stripeSecret);
}

// Permitir chamadas do seu site local e produção
const ALLOWED_ORIGINS = [
  process.env.SITE_URL,            // ex: https://seu-site.com
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

const corsHeaders = (origin) => ({
  "Access-Control-Allow-Origin": origin || "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
});

exports.handler = async (event) => {
  const origin = (event.headers && event.headers.origin) || ALLOWED_ORIGINS[0] || "*";
  const headers = corsHeaders(origin);

  // Pré-flight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed. Use POST." }),
    };
  }

  if (!stripe) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Stripe key missing (STRIPE_SECRET_KEY)." }),
    };
  }

  try {
    const body = JSON.parse(event.body || "{}");

    // Você pode mandar diretamente um priceId do Stripe
    // ou mapear planos por nome -> priceId aqui:
    // const PRICE_MAP = { basic: "price_123", pro: "price_456" };

    const { priceId, quantity = 1, customer_email, mode = "subscription", metadata = {} } = body;

    if (!priceId || typeof priceId !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "priceId é obrigatório." }),
      };
    }

    // URL base para redirecionar após sucesso/cancelamento
    const siteBase =
      process.env.SITE_URL ||
      origin ||
      "http://localhost:5173";

    const successUrl = `${siteBase}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${siteBase}/cancel`;

    // Cria a sessão no Stripe
    const session = await stripe.checkout.sessions.create({
      mode, // "subscription" (default) ou "payment" se quiser pagamento avulso
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      // recomenda-se usar customer ou customer_email (apenas um)
      ...(customer_email ? { customer_email } : {}),
      success_url: successUrl,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      // Você pode enviar dados extras para identificar usuário/plano
      metadata,
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ url: session.url, id: session.id }),
    };
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Falha ao criar sessão de checkout.",
        details: err.message || String(err),
      }),
    };
  }
};
