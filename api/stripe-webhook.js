// api/stripe-webhook.js
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// CORS headers
function applyCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Stripe-Signature");
  res.setHeader("Cache-Control", "no-store");
  
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export const config = {
  api: {
    bodyParser: false, // Stripe requires raw body
  },
};

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }

  const sig = req.headers["stripe-signature"];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ ok: false, error: "Webhook secret not configured" });
  }

  if (!process.env.STRIPE_SECRET_KEY_RKMMAX) {
    console.error("❌ STRIPE_SECRET_KEY_RKMMAX not configured");
    return res.status(500).json({ ok: false, error: "Stripe key not configured" });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY_RKMMAX, {
    apiVersion: "2024-06-20",
  });

  // Read raw body
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  const rawBody = Buffer.concat(chunks);

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).json({ ok: false, error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;
        const email = session.customer_details?.email || session.metadata?.email || null;
        const subscriptionId = session.subscription || null;

        let priceId = session.metadata?.priceId || null;
        if (!priceId) {
          try {
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ["line_items.data.price"],
            });
            priceId = fullSession.line_items?.data?.[0]?.price?.id || null;
          } catch (e) {
            console.warn("Could not expand line_items:", e.message);
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
        } catch (_) {
          console.warn("Could not retrieve customer email");
        }

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
        // Ignore other events
        console.log(`Ignoring event type: ${stripeEvent.type}`);
        break;
    }

    return res.status(200).json({ ok: true, received: true });
  } catch (err) {
    console.error("❌ Error processing webhook:", err);
    return res.status(500).json({ ok: false, error: "Server error" });
  }
}

async function upsertSubscription({
  email,
  priceId,
  subscriptionId,
  status,
  currentPeriodEnd,
}) {
  if (!email) {
    console.warn("Webhook without email — skipping upsert");
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    console.error("❌ Supabase credentials not configured");
    return;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE
  );

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

  const onConflict = subscriptionId ? "stripe_subscription_id" : "email,stripe_price_id";
  const match = subscriptionId
    ? { stripe_subscription_id: subscriptionId }
    : { email, stripe_price_id: priceId };

  const { error } = await supabase
    .from("subscriptions")
    .upsert({ ...payload, ...match }, { onConflict });

  if (error) {
    console.error("❌ Error saving to Supabase:", error);
    throw error;
  }

  console.log("✅ Subscription saved/updated:", email, status, priceId);
}

