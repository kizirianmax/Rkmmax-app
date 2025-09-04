// netlify/functions/create-checkout.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * Espera um POST com { priceId, email }
 * Retorna { url } do Stripe Checkout
 */
exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { priceId, email } = JSON.parse(event.body || "{}");
    if (!priceId) return { statusCode: 400, body: "priceId obrigatório" };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email, // opcional, facilita pro usuário logado
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: process.env.SUCCESS_URL || "https://seu-site.com/?success=1",
      cancel_url: process.env.CANCEL_URL || "https://seu-site.com/subscribe?canceled=1",
      allow_promotion_codes: true,
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: "Erro criando checkout" };
  }
};
