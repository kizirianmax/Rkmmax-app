// netlify/functions/create-checkout-session.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { planId } = JSON.parse(event.body || "{}");

    // Mapeia o planId vindo da rota para o PRICE ID do Stripe
    const priceMap = {
      basic: process.env.STRIPE_PRICE_BASIC,      // ex: price_123
      medium: process.env.STRIPE_PRICE_MEDIUM,    // ex: price_456
      premium: process.env.STRIPE_PRICE_PREMIUM,  // ex: price_789
    };

    const priceId = priceMap[planId];
    if (!priceId) {
      return { statusCode: 400, body: "Invalid planId" };
    }

    // URL do seu site
    const origin =
      process.env.APP_URL ||
      event.headers.origin ||
      `https://${event.headers.host}`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${origin}/?checkout=success`,
      cancel_url: `${origin}/plans?checkout=cancel`,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
