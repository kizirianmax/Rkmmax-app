// netlify/functions/checkout.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Mapa dos prices (puxados de env)
const PRICE_MAP = {
  basic: {
    BR: process.env.STRIPE_PRICE_SIMPLE_BR,
    US: process.env.STRIPE_PRICE_SIMPLE_US,
  },
  mid: {
    BR: process.env.STRIPE_PRICE_MEDIUM_BR,
    US: process.env.STRIPE_PRICE_MEDIUM_US,
  },
  premium: {
    BR: process.env.STRIPE_PRICE_TOP_BR,
    US: process.env.STRIPE_PRICE_TOP_US,
  },
};

// Detecta região a partir do header de geolocalização do Netlify ou Accept-Language
function pickRegion(event) {
  // Netlify envia x-nf-geo com JSON { country: { code: "BR" } } em Edge/Infra deles
  const geoHeader = event.headers["x-nf-geo"] || event.headers["X-NF-GEO"];
  if (geoHeader) {
    try {
      const g = JSON.parse(geoHeader);
      const code = g?.country?.code || g?.country;
      if (code === "BR") return "BR";
    } catch {}
  }
  // Fallback por idioma
  const al = (event.headers["accept-language"] || "").toLowerCase();
  if (al.includes("pt-br") || al.startsWith("pt")) return "BR";
  return "US";
}

export const handler = async (event) => {
  // CORS (caso chame via fetch do front)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    };
  }

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const planRaw =
      (event.queryStringParameters && event.queryStringParameters.plan) || "basic";
    // normaliza possíveis nomes
    const key =
      planRaw === "simple" || planRaw === "basico" ? "basic" :
      planRaw === "medium" || planRaw === "intermediario" || planRaw === "intermediate" ? "mid" :
      planRaw === "top" || planRaw === "premium" ? "premium" :
      "basic";

    const region = pickRegion(event); // "BR" ou "US"
    const priceId = PRICE_MAP[key]?.[region];

    if (!priceId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Preço não configurado para este plano/região." }),
      };
    }

    const success = `${process.env.APP_URL}/success?cs={CHECKOUT_SESSION_ID}`;
    const cancel  = `${process.env.APP_URL}/cancel`;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: success,
      cancel_url: cancel,
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      metadata: { plan: key, intended_region: region },
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
