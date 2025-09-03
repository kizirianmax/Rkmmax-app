// src/lib/planCaps.js
export const PLAN = { BASIC: "basic", MEDIUM: "medium", PREMIUM: "premium" };

export const MODEL_BY_PLAN = {
  [PLAN.BASIC]:   { model: "gpt-4o-mini", maxDaily: 65  },
  [PLAN.MEDIUM]:  { model: "gpt-4o-mini", maxDaily: 200 },
  [PLAN.PREMIUM]: { model: "gpt-4o",      maxDaily: 999 } // invisível
};

export function selectModelForPlan(plan) {
  return (MODEL_BY_PLAN[plan] ?? MODEL_BY_PLAN[PLAN.BASIC]).model;
}
