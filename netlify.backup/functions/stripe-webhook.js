// netlify/functions/stripe-webhook.js
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const sig = event.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Netlify pode enviar body em base64; o Stripe precisa de Buffer cru
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, "base64")
    : Buffer.from(event.body || "", "utf8");

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Erro de assinatura do webhook:", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;

        const email =
          session.customer_details?.email || session.metadata?.email || null;

        const subscriptionId = session.subscription || null;

        // priceId: tente metadata primeiro; se não, expanda os line_items
        let priceId = session.metadata?.priceId || null;
        if (!priceId) {
          try {
            const fullSession = await stripe.checkout.sessions.retrieve(
              session.id,
              { expand: ["line_items.data.price"] }
            );
            priceId = fullSession.line_items?.data?.[0]?.price?.id || null;
          } catch (e) {
            console.warn("Não foi possível expandir line_items:", e.message);
          }
        }

        let sub = null;
        if (subscriptionId) {
          sub = await stripe.subscriptions.retrieve(subscriptionId);
        }

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
        // Ignore outros eventos
        break;
    }

    return { statusCode: 200, body: "ok" };
  } catch (err) {
    console.error("❌ Erro processando webhook:", err);
    return { statusCode: 500, body: "Server error" };
  }
};

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

  const payload = {
    email,
    stripe_price_id: priceId,
    stripe_subscription_id: subscriptionId,
    status,
    current_period_end: currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000).toISOString()
      : null,
    updated_at: new Date().toISOString(),
  };

  const onConflict = subscriptionId
    ? "stripe_subscription_id"
    : "email,stripe_price_id";

  const match = subscriptionId
    ? { stripe_subscription_id: subscriptionId }
    : { email, stripe_price_id: priceId };

  const { error } = await supabase
    .from("subscriptions")
    .upsert({ ...payload, ...match }, { onConflict });

  if (error) {
    console.error("Erro ao salvar no Supabase:", error);
    throw error;
  }

  console.log("✅ Subscription salva/atualizada:", email, status, priceId);
}
