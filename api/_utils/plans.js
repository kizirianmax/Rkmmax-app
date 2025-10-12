// api/_utils/plans.js
// Se o plans.json está na RAIZ do projeto:
import plansJson from "../../plans.json";
// Se você moveu para src/config/plans.json, use:
// import plansJson from "../../src/config/plans.json";

/**
 * Mapeia lookup_key do Stripe → id do plano no JSON
 */
export function getPlanByKey(planKey) {
  const map = {
    rkmmax_basic_br: "basic_br",
    rkmmax_intermediario_br: "intermediario_br",
    rkmmax_premium_br: "premium_br",
    rkmmax_basic_us: "basic_us",
    rkmmax_intermediate_us: "intermediate_us",
    rkmmax_premium_us: "premium_us",
  };
  const id = map[planKey];
  return id ? plansJson.plans[id] : null;
}

/** Retorna direto por id definido no JSON (ex.: "basic_br") */
export function getPlanById(id) {
  return plansJson.plans[id] || null;
}

/** Lista de lookup_keys válidas (se existir no JSON) */
export const ALLOWED_LOOKUP_KEYS = Object.values(plansJson.plans)
  .map((p) => p.lookup_key)
  .filter(Boolean);
