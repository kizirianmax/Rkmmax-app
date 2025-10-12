// api/me-plan.js
import { createClient } from "@supabase/supabase-js";
import { getPlanById } from "./_utils/plans.js";

// Troque se quiser liberar tudo temporariamente antes das ENVs
const FALLBACK_PLAN = "basic";

// CORS + pré-flight
function applyCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, x-user-email");
  res.setHeader("Cache-Control", "no-store");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD, OPTIONS");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // email por header (x-user-email) ou query (?email=)
  const emailHeader = req.headers["x-user-email"] || req.headers["X-User-Email"];
  const email = (emailHeader || req.query?.email || "")
    .toString()
    .trim()
    .toLowerCase();

  // Fallback se faltar SUPABASE_* no Vercel
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res.status(200).json({
      userPlan: FALLBACK_PLAN,
      reason: "fallback_no_supabase_env",
      email: email || undefined,
    });
  }

  if (!email) {
    return res.status(200).json({ userPlan: "basic", reason: "missing_email" });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, stripe_price_id, current_period_end")
      .eq("email", email)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(200).json({ userPlan: "basic", reason: "no_subscription" });
    }

    const isActive = ["active", "trialing"].includes(data.status);
    if (!isActive) {
      return res.status(200).json({ userPlan: "basic", reason: "inactive" });
    }

    // Mapeia o price do Stripe para um plano interno (se existir no plans.json)
    const planObj = getPlanById?.(data.stripe_price_id) || null;
    const plan = planObj?.id || "premium"; // se estiver ativo e não mapear, considera premium

    return res.status(200).json({
      userPlan: plan,
      planMeta: planObj,
      current_period_end: data.current_period_end,
      price_id: data.stripe_price_id,
    });
  } catch (e) {
    return res.status(500).json({ userPlan: "basic", error: String(e) });
  }
}
