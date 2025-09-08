// netlify/functions/prices.js
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handler = async (event) => {
  try {
    const regionParam = event.queryStringParameters?.region || "BR";

    const list = await stripe.prices.list({
      active: true,
      limit: 100,
      expand: ["data.product"],
    });

    const filtered = list.data.filter((p) => {
      const lookup = (p.lookup_key || "").toLowerCase();
      const regionMatch =
        lookup.startsWith(`rkm_${regionParam.toLowerCase()}_`) ||
        p.metadata?.region === regionParam;
      return regionMatch && p.recurring;
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        filtered.map((p) => ({
          id: p.id,
          nickname: p.nickname,
          currency: p.currency,
          amount: p.unit_amount / 100,
          interval: p.recurring?.interval,
          product: typeof p.product === "object" ? p.product.name : p.product,
        }))
      ),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
