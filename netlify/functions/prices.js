// netlify/functions/prices.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  try {
    // Região padrão = BR, mas pode vir via query string (?region=US)
    const region = event.queryStringParameters?.region || "BR";

    // Lista até 100 prices ativos no Stripe
    const list = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"],
    });

    // Filtra por região usando lookup_key ou metadata.region
    const filtered = list.data.filter((p) => {
      const lookup = (p.lookup_key || "").toLowerCase();
      const metaRegion = p.metadata?.region || "";
      return lookup.startsWith(`rkm_${region.toLowerCase()}_`) || metaRegion === region;
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(filtered, null, 2),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
