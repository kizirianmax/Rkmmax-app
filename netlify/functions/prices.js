// netlify/functions/prices.js
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Regras de detecção:
 * - Região: pelo prefixo do lookup_key (ex: rkm_br_basic) OU metadata.region === "BR"/"US"
 * - Tier:    "basic" ou "premium" por lookup_key/metadata.tier/nome do produto
 */
function matchesRegion(price, region) {
  const lk = (price.lookup_key || "").toLowerCase();
  const metaRegion = (price.metadata?.region || "").toLowerCase();
  return (
    lk.startsWith(`rkm_${region.toLowerCase()}_`) ||
    metaRegion === region.toLowerCase()
  );
}

function matchesTier(price, tier) {
  const lk = (price.lookup_key || "").toLowerCase();
  const metaTier = (price.metadata?.tier || "").toLowerCase();
  const prodName = (price.product?.name || "").toLowerCase();
  return (
    lk.includes(tier) ||
    metaTier === tier ||
    prodName.includes(tier)
  );
}

function fmtMoney(amount, currency, locale = "pt-BR") {
  // amount em centavos
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: (currency || "BRL").toUpperCase(),
    minimumFractionDigits: 2,
  }).format((amount || 0) / 100);
}

export const handler = async (event) => {
  try {
    const region = (event.queryStringParameters?.region || "BR").toUpperCase();

    // Busca prices recorrentes ativos (+ product para exibir nome/descrição)
    const list = await stripe.prices.list({
      active: true,
      type: "recurring",
      limit: 100,
      expand: ["data.product"],
    });

    // Filtra por região
    const regional = list.data.filter((p) => matchesRegion(p, region));

    // Seleciona o melhor price para cada tier (basic/premium): pega o menor valor
    const tiers = ["basic", "premium"];
    const labels = { basic: "Básico", premium: "Premium" };

    const results = tiers.map((tier) => {
      const candidates = regional.filter((p) => matchesTier(p, tier));
      if (candidates.length === 0) return null;

      // Escolhe o mais barato dentro do tier
      const chosen = candidates.reduce((acc, p) =>
        !acc || (p.unit_amount || 0) < (acc.unit_amount || 0) ? p : acc
      , null);

      const currency = (chosen.currency || (region === "US" ? "USD" : "BRL")).toUpperCase();
      const locale = region === "US" ? "en-US" : "pt-BR";

      return {
        id: chosen.id,
        tier: tier,                // "basic" | "premium"
        nome: labels[tier],        // "Básico" | "Premium"
        produto: chosen.product?.name || labels[tier],
        descricao: chosen.product?.description || "",
        moeda: currency,
        intervalo: chosen.recurring?.interval || "month",
        valor_centavos: chosen.unit_amount || 0,
        valor_formatado: fmtMoney(chosen.unit_amount, currency, locale),
        lookup_key: chosen.lookup_key || null,
        metadata: {
          region: chosen.metadata?.region || null,
          ...chosen.metadata,
        },
      };
    }).filter(Boolean);

    if (results.length === 0) {
      return {
        statusCode: 404,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          error: "Nenhum plano encontrado para a região.",
          region,
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(
        {
          region,
          planos: results,
        },
        null,
        2
      ),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
