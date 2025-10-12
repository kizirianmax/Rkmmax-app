// api/me-plan.js
const { createClient } = require("@supabase/supabase-js");

function applyCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-User-Email");
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");
}

function getEmail(req) {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const q = url.searchParams.get("email");
    return String(req.headers["x-user-email"] || q || "").trim().toLowerCase();
  } catch {
    return "";
  }
}

module.exports = async (req, res) => {
  applyCORS(res);

  if (req.method === "OPTIONS") return res.status(204).end();
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD, OPTIONS");
    return res.status(405).end(JSON.stringify({ ok: false, error: "method_not_allowed" }));
  }

  try {
    const email = getEmail(req);
    if (!email) {
      return res.status(200).end(JSON.stringify({ userPlan: "basic", reason: "missing_email" }));
    }

    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    // Fallback se as envs não estiverem configuradas ainda
    if (!url || !key) {
      const userPlan = email === "premium@exemplo.com" ? "premium" : "basic";
      return res
        .status(200)
        .end(JSON.stringify({ userPlan, reason: "fallback_no_supabase_env" }));
    }

    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, stripe_price_id, current_period_end")
      .eq("email", email)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return res.status(500).end(JSON.stringify({ userPlan: "basic", error: error.message }));
    }
    if (!data) {
      return res.status(200).end(JSON.stringify({ userPlan: "basic", reason: "no_subscription" }));
    }

    const isActive = ["active", "trialing"].includes(data.status);
    if (!isActive) {
      return res.status(200).end(JSON.stringify({ userPlan: "basic", reason: "inactive" }));
    }

    // (opcional) mapear stripe_price_id -> plano do seu JSON
    // const { getPlanById } = require("./_utils/plans");
    // const planObj = getPlanById?.(data.stripe_price_id) || null;
    // const userPlan = planObj?.id || "premium";

    return res.status(200).end(
      JSON.stringify({
        userPlan: "premium",
        // planMeta: planObj,
        current_period_end: data.current_period_end,
      })
    );
  } catch (e) {
    return res.status(500).end(JSON.stringify({ userPlan: "basic", error: String(e) }));
  }
};
