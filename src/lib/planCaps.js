// src/lib/planCaps.js
// ===== PLANO E LIMITES OFICIAIS RKMMax =====
// Todos os agentes liberados em todos os planos.

export const PLAN = { BASIC: "basic", MID: "mid", PREMIUM: "premium" };

/**
 * Modelo principal por plano (para uso do seu modelPicker).
 * - Basic  : GPT-5 Nano (barato e rápido)
 * - Mid    : GPT-4.1 Mini (equilíbrio custo/qualidade)
 * - Premium: híbrido (Mini p/ dia a dia + GPT-5 Standard sob demanda)
 */
export const MODEL_BY_PLAN = {
  [PLAN.BASIC]:   { model: "gpt-5-nano" },
  [PLAN.MID]:     { model: "gpt-4.1-mini" },
  // No Premium, o "modelo principal" do dia a dia é mini.
  [PLAN.PREMIUM]: { model: "gpt-4.1-mini" },
};

/**
 * Limites de consumo
 * - tokensDaily: limite diário por usuário (reinicia todo dia, UTC ou timezone do app)
 * - tokensMonthly5: saldo MENSAL acumulativo só para GPT-5 Standard (premium)
 */
export const LIMITS = {
  [PLAN.BASIC]: {
    tokensDaily: 275_000,    // ~R$10/mês reservados – BLOQUEIO DIÁRIO
    tokensMonthly5: 0,       // sem GPT-5 no básico
  },
  [PLAN.MID]: {
    tokensDaily: 410_000,    // ~R$20/mês reservados – BLOQUEIO DIÁRIO
    tokensMonthly5: 0,
  },
  [PLAN.PREMIUM]: {
    tokensDaily: 1_200_000,  // ~US$10.8/mês em 4.1-mini → ~1.2M/dia
    tokensMonthly5: 710_000, // ~US$4/mês em GPT-5 Standard (ACUMULATIVO)
  },
};

// Recursos por plano (para UI e gates)
export const FEATURES = {
  [PLAN.BASIC]:   { allAgents: true, voice: false,  personalization: true, multiAgents: 1 },
  [PLAN.MID]:     { allAgents: true, voice: true,   personalization: true, multiAgents: 2 },
  [PLAN.PREMIUM]: { allAgents: true, voice: true,   personalization: true, multiAgents: 3, hybrid: true },
};

// Helper para o front exibir rótulos
export const PLAN_LABEL = {
  [PLAN.BASIC]:   "Básico",
  [PLAN.MID]:     "Intermediário",
  [PLAN.PREMIUM]: "Premium",
};
