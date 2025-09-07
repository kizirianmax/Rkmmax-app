// netlify/functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

export async function handler(event) {
  try {
    // CORS básico
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
    };
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 200, headers: corsHeaders, body: "OK" };
    }
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: corsHeaders, body: "Method Not Allowed" };
    }

    const { priceKey, success_url, cancel_url } = JSON.parse(event.body || "{}");
    if (!priceKey) {
      throw new Error("Missing priceKey");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceKey, quantity: 1 }],
      success_url:
        success_url ||
        `${process.env.SITE_URL || "https://kizirianmax.site"}/account?checkout=success`,
      cancel_url:
        cancel_url ||
        `${process.env.SITE_URL || "https://kizirianmax.site"}/plans?checkout=cancel`,
      automatic_tax: { enabled: true },
    });

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err) {
    console.error("Stripe error:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({
        error: err.message || "Erro interno ao criar checkout",
      }),
    };
  }
}
