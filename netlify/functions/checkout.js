// netlify/functions/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_RKMMAX, {
  apiVersion: "2024-06-20",
});

export async function handler(event) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { lookupKey } = JSON.parse(event.body || "{}");
    if (!lookupKey) {
      return { statusCode: 400, body: "Missing lookupKey" };
    }

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

    const site =
      process.env.SITE_URL || process.env.URL || "http://localhost:3000";

    const successUrl = `${site}/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${site}/pricing`; // <-- alterado aqui

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      billing_address_collection: "auto",
      allow_promotion_codes: true,
      line_items: [{ price: price.id, quantity: 1 }],
      success_url: successUrl,
      cancel_url: cancelUrl,
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
