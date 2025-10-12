// api/me-plan.js
import { createClient } from "@supabase/supabase-js";

// 🔧 Mude aqui se quiser liberar tudo antes das ENVs:
const FALLBACK_PLAN = "basic"; // troque para "premium" se quiser liberar temporariamente

function applyCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
}

export default async function handler(req, res) {
  applyCORS(res);

  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  // email pode vir por header (x-user-email) ou query (?email=)
  const email =
    (req.headers["x-user-email"] || req.query?.email || "")
      .toString()
      .trim()
      .toLowerCase();

  // Fallback se faltarem ENVs do Supabase na Vercel
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return res
      .status(200)
      .json({ userPlan: FALLBACK_PLAN, reason: "fallback_no_supabase_env", email: email || undefined });
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

    // Se quiser mapear stripe_price_id -> plano interno, faça aqui.
    // Por enquanto, ativo = premium.
    const plan = "premium";

    return res.status(200).json({
      userPlan: plan,
      current_period_end: data.current_period_end,
      price_id: data.stripe_price_id
    });
  } catch (e) {
    return res.status(500).json({ userPlan: "basic", error: String(e) });
  }
}
