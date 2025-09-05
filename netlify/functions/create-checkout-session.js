// netlify/functions/create-checkout-session.js
// Backend: cria uma sessão de Checkout do Stripe para assinaturas

const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.error("STRIPE_SECRET_KEY não definido nas variáveis de ambiente!");
}
const stripe = require("stripe")(stripeSecret);

/** Util: resposta JSON */
const json = (statusCode, data, extraHeaders = {}) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",          // libere o front (ajuste se quiser)
    "Access-Control-Allow-Methods": "POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...extraHeaders,
  },
  body: JSON.stringify(data),
});

exports.handler = async (event) => {
  try {
    // Preflight CORS
    if (event.httpMethod === "OPTIONS") {
      return json(200, { ok: true });
    }

    // Só POST
    if (event.httpMethod !== "POST") {
      return json(405, { error: "Method Not Allowed" });
    }

    if (!stripeSecret) {
      return json(500, { error: "Servidor sem STRIPE_SECRET_KEY configurada" });
    }

    // Pega origem/host de forma robusta (local, Netlify, etc.)
    const proto = event.headers["x-forwarded-proto"] || "https";
    const host  = event.headers.host || "localhost:5173";
    const origin = event.headers.origin || `${proto}://${host}`;

    // Lê o body
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch {
      return json(400, { error: "JSON inválido" });
    }

    const { priceId, email } = body;
    if (!priceId) {
      return json(400, { error: "priceId é obrigatório" });
    }

    // Cria a sessão de checkout (assinatura)
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined, // opcional
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/subscribe?success=1`,
      cancel_url: `${origin}/subscribe?canceled=1`,
      // Você pode adicionar metadata aqui se quiser rastrear plano/usuário
      // metadata: { plan: priceId, source: "web" },
    });

    return json(200, { url: session.url });
  } catch (err) {
    console.error("Stripe error:", err);
    // Mostre mensagem amigável, detalle no console
    return json(500, { error: "Falha ao criar sessão de checkout" });
  }
};
