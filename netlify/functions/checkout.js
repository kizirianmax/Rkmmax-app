// netlify/functions/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_RKMMAX);

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { priceId: incoming } = JSON.parse(event.body || "{}");

    // ✅ Sanitiza: remove aspas simples/duplas e espaços extras
    const priceId = String(incoming || "")
      .replace(/^['"]+|['"]+$/g, "")
      .trim();

    if (!priceId) {
      return { statusCode: 400, body: "Missing priceId" };
    }

    const appUrl = process.env.APP_URL || process.env.URL;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      success_url: `${appUrl}/subscribe?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/subscribe?status=cancelled`,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url: session.url, id: session.id }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
}
