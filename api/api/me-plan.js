// api/me-plan.js
import { createClient } from "@supabase/supabase-js";

// CORS básico (igual ao que você usava no Netlify)
function applyCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
}

// ⚠️ Garanta essas variáveis no Vercel (Project → Settings → Environment Variables)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Se você quiser mapear stripe_price_id → plano, mova seu helper para api/_utils/plans.js
// e descomente a import abaixo:
// import { getPlanById } from "./_utils/plans";

export default async function handler(req, res) {
  applyCORS(res);

  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  }

  try {
    const email =
      (req.headers["x-user-email"] ||
        req.headers["X-User-Email"] ||
        req.query.email ||
        "")
        .toString()
        .trim()
        .toLowerCase();

    if (!email) {
      return res
        .status(200)
        .json({ userPlan: "basic", reason: "missing_email_header" });
    }

    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, stripe_price_id, current_period_end")
      .eq("email", email)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).json({ userPlan: "basic", error: error.message });
    }
    if (!data) {
      return res.status(200).json({ userPlan: "basic", reason: "no_subscription" });
    }

    const isActive = ["active", "trialing"].includes(data.status);
    if (!isActive) {
      return res.status(200).json({ userPlan: "basic", reason: "inactive" });
    }

    // Tenta mapear o preço do Stripe para um plano; fallback = "premium"
    // const planObj = typeof getPlanById === "function" ? getPlanById(data.stripe_price_id) : null;
    // const userPlan = planObj?.id || "premium";
    const userPlan = "premium"; // <-- troque pelas 2 linhas acima se usar getPlanById

    return res.status(200).json({
      userPlan,
      // planMeta: planObj, // habilite se usar getPlanById
      current_period_end: data.current_period_end,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ userPlan: "basic", error: e?.message || String(e) });
  }
}
