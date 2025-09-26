// netlify/functions/me-plan.js
import { createClient } from "@supabase/supabase-js";
import { getPlanById } from "./plans.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// helper de resposta JSON + CORS básico
const resp = (status, data) => ({
  statusCode: status,
  headers: {
    "content-type": "application/json",
    "access-control-allow-origin": "*"
  },
  body: JSON.stringify(data)
});

/**
 * Retorna o plano atual do usuário pelo email (via header "x-user-email").
 * Se não achar assinatura ativa, retorna { userPlan: "basic" }.
 */
export async function handler(event) {
  try {
    const email = event.headers["x-user-email"] || event.headers["X-User-Email"];
    if (!email) {
      return resp(200, { userPlan: "basic", reason: "missing_email_header" });
    }

    // pega a assinatura mais recente do usuário
    const { data, error } = await supabase
      .from("subscriptions")
      .select("status, stripe_price_id, current_period_end")
      .eq("email", email)
      .order("current_period_end", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return resp(500, { userPlan: "basic", error: error.message });
    if (!data) return resp(200, { userPlan: "basic", reason: "no_subscription" });

    const isActive = ["active", "trialing"].includes(data.status);
    if (!isActive) return resp(200, { userPlan: "basic", reason: "inactive" });

    // tenta mapear o preço do Stripe para um plano definido no JSON
    const planObj = getPlanById?.(data.stripe_price_id) || null;
    const userPlan = planObj?.id || "premium"; // fallback: considera premium se ativo

    return resp(200, {
      userPlan,
      planMeta: planObj,
      current_period_end: data.current_period_end
    });
  } catch (e) {
    return resp(500, { userPlan: "basic", error: e.message });
  }
}
