// netlify/functions/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

/**
 * Espera corpo JSON: { lookupKey: "rkmmax_basic_br" }
 * Cria uma sessão de checkout de assinatura e retorna { url }
 */
export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { lookupKey } = JSON.parse(event.body || "{}");
    if (!lookupKey) {
      return { statusCode: 400, body: "Missing lookupKey" };
    }

    // Busca o preço pelo lookup_key (ativo)
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      active: true,
      limit: 1,
      expand: ["data.product"],
    });

    const price = prices.data?.[0];
    if (!price) {
      return { statusCode: 404, body: "Price not found for lookupKey" };
    }

    const successUrl =
      process.env.SUCCESS_URL ||
      `${process.env.SITE_URL || "https://rkmmmax.netlify.app"}/success`;
    const cancelUrl =
      process.env.CANCEL_URL ||
      `${process.env.SITE_URL || "https://rkmmmax.netlify.app"}/plans`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      billing_address_collection: "auto",
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      allow_promotion_codes: true,
      metadata: { lookup_key: lookupKey },
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Checkout error" };
  }
}
