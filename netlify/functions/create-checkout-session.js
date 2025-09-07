// netlify/functions/create-checkout-session.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { priceKey } = JSON.parse(event.body || "{}");

    if (!priceKey) {
      return { statusCode: 400, body: "Missing priceKey" };
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceKey, // vem do front (ex: price_12345)
          quantity: 1,
        },
      ],
      allow_promotion_codes: true,
      success_url: `${process.env.APP_URL}/subscribe?status=success`,
      cancel_url: `${process.env.APP_URL}/subscribe?status=cancelled`,
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ id: session.id, url: session.url }),
    };
  } catch (err) {
    console.error("Stripe session error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Erro interno ao criar checkout",
        details: err.message,
      }),
    };
  }
};
