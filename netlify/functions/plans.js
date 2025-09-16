import plansJson from '../../..//config/plans.json' assert { type: 'json' };

export function getPlanByKey(planKey) {
  const map = {
    rkmmax_basic_br: 'basic_br',
    rkmmax_intermediario_br: 'intermediario_br',
    rkmmax_premium_br: 'premium_br',
    rkmmax_basic_us: 'basic_us',
    rkmmax_intermediate_us: 'intermediate_us',
    rkmmax_premium_us: 'premium_us',
  };
  const id = map[planKey];
  return id ? plansJson.plans[id] : null;
}

export function getPlanById(id) {
  return plansJson.plans[id] || null;
}

export const ALLOWED_LOOKUP_KEYS = Object.values(plansJson.plans).map(p => p.lookup_key);
