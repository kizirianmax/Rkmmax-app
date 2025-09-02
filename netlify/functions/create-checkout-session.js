// netlify/functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Mapeia os planos para os preços do Stripe (definidos no .env.local / Netlify)
const PRICE_BY_PLAN = {
  simple: process.env.STRIPE_PRICE_SIMPLE,
  medium: process.env.STRIPE_PRICE_MEDIUM,
  top: process.env.STRIPE_PRICE_TOP,
};

// URL do app (local ou em produção)
const APP_URL = process.env.APP_URL || "http://localhost:5173";

export async function handler(event) {
  try {
    const { planId } = JSON.parse(event.body);

    if (!PRICE_BY_PLAN[planId]) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Plano inválido." }),
      };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price: PRICE_BY_PLAN[planId],
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/success`,
      cancel_url: `${APP_URL}/plans`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (error) {
    console.error("Erro Stripe:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
