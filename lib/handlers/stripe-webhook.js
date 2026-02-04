// lib/handlers/stripe-webhook.js
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

// Structured logging
function log(level, message, data = {}) {
  const timestamp = new Date().toISOString();
  const logData = { timestamp, level, message, ...data };
  
  if (level === "error") {
    console.error(JSON.stringify(logData));
  } else {
    console.log(JSON.stringify(logData));
  }
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
    log("error", "STRIPE_WEBHOOK_SECRET not configured");
    return res.status(500).json({ ok: false, error: "Webhook secret not configured" });
  }

  if (!process.env.STRIPE_SECRET_KEY_RKMMAX) {
    log("error", "STRIPE_SECRET_KEY_RKMMAX not configured");
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
    log("info", "Webhook signature verified", { eventType: stripeEvent.type, eventId: stripeEvent.id });
  } catch (err) {
    log("error", "Webhook signature verification failed", { error: err.message });
    return res.status(400).json({ ok: false, error: `Webhook Error: ${err.message}` });
  }

  try {
    switch (stripeEvent.type) {
      case "checkout.session.completed": {
        const session = stripeEvent.data.object;
        const email = session.customer_details?.email || session.metadata?.email || null;
        const subscriptionId = session.subscription || null;

        log("info", "Processing checkout.session.completed", { email, subscriptionId });

        let priceId = session.metadata?.priceId || null;
        if (!priceId) {
          try {
            const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
              expand: ["line_items.data.price"],
            });
            priceId = fullSession.line_items?.data?.[0]?.price?.id || null;
          } catch (e) {
            log("warn", "Could not expand line_items", { error: e.message });
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

        // Enviar e-mail de boas-vindas
        if (email) {
          try {
            await sendWelcomeEmail({ email, session });
            log("info", "Welcome email sent", { email });
          } catch (emailError) {
            log("error", "Failed to send welcome email", { email, error: emailError.message });
            // Não falhar o webhook por causa do e-mail
          }
        }

        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = stripeEvent.data.object;

        log("info", `Processing ${stripeEvent.type}`, { subscriptionId: sub.id, status: sub.status });

        let email = null;
        try {
          const customer = await stripe.customers.retrieve(sub.customer);
          email = customer?.email || null;
        } catch (e) {
          log("warn", "Could not retrieve customer email", { customerId: sub.customer });
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

      case "invoice.payment_failed": {
        const invoice = stripeEvent.data.object;
        const subscriptionId = invoice.subscription;
        
        log("warn", "Payment failed", { subscriptionId, invoiceId: invoice.id });

        if (subscriptionId) {
          try {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const customer = await stripe.customers.retrieve(sub.customer);
            const email = customer?.email || null;

            if (email) {
              await sendPaymentFailedEmail({ email, invoice });
              log("info", "Payment failed email sent", { email });
            }
          } catch (e) {
            log("error", "Failed to process payment failure", { error: e.message });
          }
        }

        break;
      }

      case "customer.subscription.trial_will_end": {
        const sub = stripeEvent.data.object;
        
        log("info", "Trial ending soon", { subscriptionId: sub.id });

        try {
          const customer = await stripe.customers.retrieve(sub.customer);
          const email = customer?.email || null;

          if (email) {
            await sendTrialEndingEmail({ email, subscription: sub });
            log("info", "Trial ending email sent", { email });
          }
        } catch (e) {
          log("error", "Failed to send trial ending email", { error: e.message });
        }

        break;
      }

      default:
        log("info", "Ignoring event type", { eventType: stripeEvent.type });
        break;
    }

    return res.status(200).json({ ok: true, received: true });
  } catch (err) {
    log("error", "Error processing webhook", { error: err.message, stack: err.stack });
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
    log("warn", "Webhook without email — skipping upsert");
    return;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE) {
    log("error", "Supabase credentials not configured");
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
    log("error", "Error saving to Supabase", { error: error.message, email });
    throw error;
  }

  log("info", "Subscription saved/updated", { email, status, priceId });
}

async function sendWelcomeEmail({ email, session }) {
  if (!email) return;

  const customerName = session?.customer_details?.name || null;
  
  let planName = "Premium";
  const priceId = session?.metadata?.priceId || null;
  if (priceId?.includes("basic")) planName = "Básico";
  else if (priceId?.includes("inter")) planName = "Intermediário";

  const emailHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao RKMMAX</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="font-size: 32px; font-weight: 800; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; margin-bottom: 16px;">RKMMAX</div>
      <h1 style="font-size: 28px; font-weight: 800; color: #1e293b; margin-bottom: 16px;">Bem-vindo ao RKMMAX ${planName}! 🎉</h1>
      <p style="font-size: 16px; color: #64748b;">
        ${customerName ? `Olá ${customerName}! ` : ''}Sua assinatura foi ativada com sucesso!
      </p>
    </div>

    <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border-radius: 12px; padding: 24px; margin-bottom: 32px;">
      <h2 style="font-size: 20px; font-weight: 700; margin-bottom: 16px;">O que você ganhou:</h2>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px;">🤖 <strong>54 Especialistas em IA</strong></li>
        <li style="margin-bottom: 12px;">💬 <strong>KIZI - Assistente Pessoal 24/7</strong></li>
        <li style="margin-bottom: 12px;">📚 <strong>Study Lab Premium</strong></li>
        <li style="margin-bottom: 12px;">⚡ <strong>Processamento Prioritário</strong></li>
        <li style="margin-bottom: 12px;">💎 <strong>Suporte Premium</strong></li>
      </ul>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="https://rkmmax-app.vercel.app/agents" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%); color: #000; text-decoration: none; border-radius: 12px; font-weight: 700; margin: 8px;">
        🎯 Explorar Especialistas
      </a>
      <a href="https://rkmmax-app.vercel.app/serginho" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700; margin: 8px;">
        💬 Chat com KIZI
      </a>
    </div>

    <div style="text-align: center; padding-top: 24px; border-top: 2px solid #e2e8f0; font-size: 14px; color: #64748b;">
      <p>Precisa de ajuda? <a href="mailto:suporte@kizirianmax.site" style="color: #6366f1;">suporte@kizirianmax.site</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const apiUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/send-email`
      : 'http://localhost:3000/api/send-email';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: `Bem-vindo ao RKMMAX ${planName}! 🎉`,
        html: emailHTML,
        type: 'welcome'
      })
    });

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.error || "Failed to send email");
    }
  } catch (error) {
    log("error", "Failed to send welcome email", { email, error: error.message });
    throw error;
  }
}

async function sendPaymentFailedEmail({ email, invoice }) {
  if (!email) return;

  const emailHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Problema com seu pagamento</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="font-size: 48px; margin-bottom: 16px;">⚠️</div>
      <h1 style="font-size: 24px; font-weight: 800; color: #dc2626; margin-bottom: 16px;">Problema com seu pagamento</h1>
      <p style="font-size: 16px; color: #64748b;">
        Não conseguimos processar seu pagamento. Por favor, atualize suas informações de pagamento.
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="https://billing.stripe.com/p/login/${process.env.STRIPE_CUSTOMER_PORTAL_ID || ''}" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: #fff; text-decoration: none; border-radius: 12px; font-weight: 700;">
        🔧 Atualizar Pagamento
      </a>
    </div>

    <div style="text-align: center; padding-top: 24px; border-top: 2px solid #e2e8f0; font-size: 14px; color: #64748b;">
      <p>Precisa de ajuda? <a href="mailto:suporte@kizirianmax.site" style="color: #6366f1;">suporte@kizirianmax.site</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const apiUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/send-email`
      : 'http://localhost:3000/api/send-email';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: '⚠️ Problema com seu pagamento - RKMMAX',
        html: emailHTML,
        type: 'payment_failed'
      })
    });

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.error || "Failed to send email");
    }
  } catch (error) {
    log("error", "Failed to send payment failed email", { email, error: error.message });
    throw error;
  }
}

async function sendTrialEndingEmail({ email, subscription }) {
  if (!email) return;

  const trialEnd = new Date(subscription.trial_end * 1000);
  const daysLeft = Math.ceil((trialEnd - new Date()) / (1000 * 60 * 60 * 24));

  const emailHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Seu teste está acabando</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
  <div style="background: #ffffff; border-radius: 16px; padding: 40px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
    <div style="text-align: center; margin-bottom: 32px;">
      <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
      <h1 style="font-size: 24px; font-weight: 800; color: #1e293b; margin-bottom: 16px;">Seu teste acaba em ${daysLeft} dias</h1>
      <p style="font-size: 16px; color: #64748b;">
        Não perca acesso aos 54 especialistas em IA e ao KIZI!
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 32px;">
      <a href="https://rkmmax-app.vercel.app/pricing" style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%); color: #000; text-decoration: none; border-radius: 12px; font-weight: 700;">
        🚀 Assinar Agora
      </a>
    </div>

    <div style="text-align: center; padding-top: 24px; border-top: 2px solid #e2e8f0; font-size: 14px; color: #64748b;">
      <p>Precisa de ajuda? <a href="mailto:suporte@kizirianmax.site" style="color: #6366f1;">suporte@kizirianmax.site</a></p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    const apiUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/api/send-email`
      : 'http://localhost:3000/api/send-email';

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: `⏰ Seu teste acaba em ${daysLeft} dias - RKMMAX`,
        html: emailHTML,
        type: 'trial_ending'
      })
    });

    const result = await response.json();
    
    if (!result.ok) {
      throw new Error(result.error || "Failed to send email");
    }
  } catch (error) {
    log("error", "Failed to send trial ending email", { email, error: error.message });
    throw error;
  }
}