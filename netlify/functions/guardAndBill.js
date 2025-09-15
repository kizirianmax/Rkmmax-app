// /netlify/functions/guardAndBill.js
import { LIMITS, PLAN } from "../../src/lib/planCaps.js";
import { getUsage, setUsage } from "./_usage.js";

// estimativa simples (você pode trocar por tiktoken depois)
function estimateTokens(inputChars = 0, outputChars = 0) {
  return Math.ceil((inputChars + outputChars) / 4); // ~4 chars por token
}

export async function guardAndBill({ user, plan, model, promptSize, expectedOutputSize }) {
  const limits = LIMITS[plan] || LIMITS[PLAN.BASIC];
  const usage = await getUsage(user.id);

  // 1) limite diário (vale para todos os modelos)
  const estimate = estimateTokens(promptSize, expectedOutputSize);
  const dailyUsed = usage.dailyTokens || 0;
  if (dailyUsed + estimate > limits.tokensDaily) {
    throw new Error("Limite diário atingido. Faça upgrade ou aguarde o próximo dia.");
  }

  // 2) limite mensal só para consumo GPT-5 (premium acumulativo)
  if (model?.startsWith("gpt-5")) {
    const monthly5Used = usage.monthly5Tokens || 0;
    if (monthly5Used + estimate > limits.tokensMonthly5) {
      throw new Error("Limite mensal do GPT-5 atingido. Tente com o modelo mini ou aguarde o próximo mês.");
    }
  }

  // Se passou, “reserva” o uso
  const newDaily = dailyUsed + estimate;
  const newMonthly5 = (usage.monthly5Tokens || 0) + (model?.startsWith("gpt-5") ? estimate : 0);
  await setUsage(user.id, { dailyTokens: newDaily, monthly5Tokens: newMonthly5 });

  // Retorne a estimativa para logs/telemetria se quiser
  return { estimate };
}
