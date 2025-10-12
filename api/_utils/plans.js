// api/_utils/plans.js
// Import simples do JSON (sem "assert") — compatível com Next/Vercel.
// Ajuste o caminho se você mover o plans.json de lugar.
import plansJson from "../../plans.json";

// Mapeia lookup_key do Stripe → id do plano no seu JSON
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

// Busca pelo id interno do JSON (ex.: "basic_br")
export function getPlanById(id) {
  return plansJson.plans[id] || null;
}

// Lista de lookup_keys permitidos (se precisar validar)
export const ALLOWED_LOOKUP_KEYS = Object.values(plansJson.plans).map(
  (p) => p.lookup_key
);
