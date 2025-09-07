// netlify/functions/create-checkout-session.js
// Node 18+ (padrão no Netlify). Precisa do pacote "stripe" instalado no projeto.

exports.handler = async (event) => {
  try {
    // Apenas POST
    if (event.httpMethod !== "POST") {
      return {
        statusCode: 405,
        body: JSON.stringify({ error: "Method not allowed" }),
      };
    }

    // Parse do body
    let payload = {};
    try {
      payload = JSON.parse(event.body || "{}");
    } catch {
      return { statusCode: 400, body: JSON.stringify({ error: "Bad JSON" }) };
    }

    // Mapa de chaves amigáveis -> variáveis de ambiente
    const PRICE_MAP = {
      // Brasil
      simple_br: process.env.STRIPE_PRICE_SIMPLE_BR,
      medium_br: process.env.STRIPE_PRICE_MEDIUM_BR,
      top_br: process.env.STRIPE_PRICE_TOP_BR,
      // EUA
      simple_us: process.env.STRIPE_PRICE_SIMPLE_US,
      medium_us: process.env.STRIPE_PRICE_MEDIUM_US,
      top_us: process.env.STRIPE_PRICE_TOP_US,
    };

    const priceKey = String(payload.priceKey || "").toLowerCase();
    const price = PRICE_MAP[priceKey];

    if (!price) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "priceKey inválido" }),
      };
    }

    // Stripe
    const stripeSecret = process.env.STRIPE_SECRET_KEY;
    if (!stripeSecret) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "STRIPE_SECRET_KEY não configurada" }),
      };
    }

    const Stripe = require("stripe");
    const stripe = Stripe(stripeSecret);

    // URLs de retorno
    const appUrl =
      process.env.APP_URL ||
      process.env.URL || // Netlify define URL do site publicado
      "https://kizirianmax.site"; // fallback

    const success_url = `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancel_url = `${appUrl}/pricing?canceled=1`;

    // Cria sessão de checkout
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      success_url,
      cancel_url,
      allow_promotion_codes: true,
      // Para identificar o plano escolhido (opcional)
      metadata: { priceKey },
      // Para quem usa login, pode passar customer_email aqui se tiver
      // customer_email: payload.email || undefined,
    });

    // CORS + resposta
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno ao criar checkout" }),
    };
  }
};
