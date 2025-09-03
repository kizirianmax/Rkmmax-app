// src/lib/modelPicker.js
import { PLAN, MODEL_BY_PLAN } from "./planCaps";
import { needsFullModel } from "./complexity";

// Decide qual modelo usar de acordo com o plano e a complexidade da pergunta
export function pickModel(plan, prompt, opts = {}) {
  const base = MODEL_BY_PLAN[plan] ?? MODEL_BY_PLAN[PLAN.BASIC];

  // Se for Premium, decide dinamicamente
  if (plan === PLAN.PREMIUM) {
    if (needsFullModel(prompt, opts)) {
      return "gpt-4o"; // modelo mais completo
    }
    return "gpt-4o-mini"; // usa o mini na maioria
  }

  // Para os outros planos, segue o modelo fixo
  return base.model;
}
