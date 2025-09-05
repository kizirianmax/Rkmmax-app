// netlify/functions/stripe-webhook.js
// Webhook do Stripe: valida assinatura e atualiza Supabase com o status da assinatura

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // CHAVE SECRETA (live ou test)
const { createClient } = require("@supabase/supabase-js");

// ⚠️ Use a SERVICE ROLE KEY no backend (NÃO colocar no frontend)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// Netlify: precisamos do "raw body" para verificar a assinatura do Stripe
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET; // da tela do Stripe (endpoint secret)
  const body = event.body; // string RAW

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Erro de assinatura do webhook:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;
        // email pode vir de customer_details ou metadata (dependendo de como criamos a sessão)
        const email =
          session.customer_details?.email || session.metadata?.email || null;

        const subscriptionId = session.subscription || null;
        const priceId =
          session.display_items?.[0]?.price?.id || session.metadata?.priceId;

        // Busca a assinatura no Stripe p/ datas e status mais precisos
        let sub = null;
        if (subscriptionId) {
          sub = await stripe.subscriptions.retrieve(subscriptionId);
        }

        // Salva/atualiza a inscrição no Supabase (tabela "subscriptions")
        // Schema sugerido abaixo na seção 4
        await upsertSubscription({
          email,
          priceId,
          subscriptionId,
          status: sub?.status || "active",
          currentPeriodEnd: sub?.current_period_end || null,
        });

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = stripeEvent.data.object;
        // Obter email via customer -> buscar o customer
        let email = null;
        try {
          const customer = await stripe.customers.retrieve(sub.customer);
          email = customer?.email || null;
        } catch (_) {}

        await upsertSubscription({
          email,
          priceId: sub.items?.data?.[0]?.price?.id || null,
          subscriptionId: sub.id,
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
        });

        break;
      }

      default:
        // Outros eventos: ignore
        break;
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("❌ Erro processando webhook:", err);
    return { statusCode: 500, body: "Server error" };
  }
};

// Helper: insere/atualiza assinatura por email + subscriptionId ou email + priceId
async function upsertSubscription({
  email,
  priceId,
  subscriptionId,
  status,
  currentPeriodEnd,
}) {
  if (!email) {
    console.warn("Webhook sem email — pulando upsert.");
    return;
  }

  // upsert por (email, subscription_id) quando existir; fallback: (email, price_id)
  const payload = {
    email,
    stripe_price_id: priceId,
    stripe_subscription_id: subscriptionId,
    status,
    current_period_end: currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toISOString() : null,
    updated_at: new Date().toISOString(),
  };

  // Se tiver subscription_id tentamos por ele, senão por (email + price)
  const match = subscriptionId
    ? { stripe_subscription_id: subscriptionId }
    : { email, stripe_price_id: priceId };

  const { error } = await supabase
    .from("subscriptions")
    .upsert({ ...payload, ...match }, { onConflict: subscriptionId ? "stripe_subscription_id" : "email,stripe_price_id" });

  if (error) {
    console.error("Erro ao salvar no Supabase:", error);
    throw error;
  }

  console.log("✅ Subscription salva/atualizada:", email, status, priceId);
}
