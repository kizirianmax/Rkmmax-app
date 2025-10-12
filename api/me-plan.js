// api/me-plan.js
import { createClient } from "@supabase/supabase-js";

// CORS básico
function applyCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
}

// ⚠️ Configure essas variáveis no Vercel (Project → Settings → Environment Variables)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Se quiser mapear stripe_price_id → plano depois, mova seu helper para api/_utils/plans.js
// import { getPlanById } from "./_utils/plans";

export default async function handler(req, res) {
  applyCORS(res);

  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const email =
      req.headers["x-user-email"] ||
      req.headers["X-User-Email"] ||
      req.query.email ||
      "";

    if (!email) {
      return res.status(200).json({ userPlan: "basic", reason: "missing_email" });
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, stripe_price_id, current_period_end")
      .eq("email", email)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return res.status(500).json({ userPlan: "basic", error: error.message });
    if (!data) return res.status(200).json({ userPlan: "basic", reason: "no_subscription" });

    const isActive = ["active", "trialing"].includes(data.status);
    if (!isActive) return res.status(200).json({ userPlan: "basic", reason: "inactive" });

    // const planObj = getPlanById?.(data.stripe_price_id) || null;
    // const userPlan = planObj?.id || "premium";
    const userPlan = "premium"; // até mapear stripe_price_id

    return res.status(200).json({
      userPlan,
      // planMeta: planObj || null,
      current_period_end: data.current_period_end
    });
  } catch (e) {
    return res.status(500).json({ userPlan: "basic", error: e.message });
  }
}
