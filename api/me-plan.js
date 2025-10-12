// api/me-plan.js
import { createClient } from "@supabase/supabase-js";

// CORS + no-cache
function applyCORS(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
}

function send(res, status, data) {
  applyCORS(res);
  return res.status(status).json(data);
}

// 👉 Ajuste se quiser um fallback diferente durante testes
//   - "basic" = seguro p/ produção
//   - "premium" = libera tudo enquanto você configura o Supabase
const FALLBACK_PLAN = "premium";tdefault async function handler(req, res) {
  applyCORS(res);

  // aceita apenas GET/HEAD
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return send(res, 405, { ok: false, error: "method_not_allowed" });
  }

  // e-mail pelo header ou querystring
  const email =
    req.headers["x-user-email"] ||
    req.query.email ||
    "";

  if (!email) {
    return send(res, 200, { userPlan: "basic", reason: "missing_email" });
  }

  const hasEnv =
    !!process.env.SUPABASE_URL && !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Sem env do Supabase → fallback (evita 500)
  if (!hasEnv) {
    return send(res, 200, {
      userPlan: FALLBACK_PLAN,
      reason: "fallback_no_supabase_env",
    });
  }

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );

    // busca a assinatura mais recente do usuário
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, stripe_price_id, current_period_end")
      .eq("email", email)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return send(res, 200, { userPlan: "basic", reason: "supabase_error", error: error.message });
    }
    if (!data) {
      return send(res, 200, { userPlan: "basic", reason: "no_subscription" });
    }

    const active = ["active", "trialing"].includes(data.status);
    const userPlan = active ? "premium" : "basic";

    return send(res, 200, {
      userPlan,
      current_period_end: data.current_period_end,
      status: data.status,
    });
  } catch (e) {
    return send(res, 200, { userPlan: "basic", reason: "exception", error: String(e) });
  }
}
