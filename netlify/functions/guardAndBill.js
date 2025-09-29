// netlify/functions/guardAndBill.js
import { getStore } from "@netlify/blobs";
import { PLAN_CAPS } from "../../src/lib/planCaps.js";

/** Normaliza nomes vindos do app/Stripe/etc. */
function normalizePlan(plan = "") {
  const p = String(plan).toLowerCase();
  if (["pro", "inter", "intermediate"].includes(p)) return "intermediate";
  if (p.startsWith("basic")) return "basic";
  if (p.startsWith("premium")) return "premium";
  return p; // tenta usar como veio
}

/** Aproximação segura: ~4 chars ≈ 1 token (ajuste se quiser) */
function charsToTokens(chars = 0) {
  return Math.ceil((chars || 0) / 4);
}

/** Chaves por usuário/período (UTC) */
function dayKey(userId) {
  const d = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  return `usage:${userId}:day:${d}`;
}
function monthKey(userId) {
  const m = new Date().toISOString().slice(0, 7); // YYYY-MM
  return `usage:${userId}:month:${m}`;
}

/** Utilitários de leitura/gravação no Blobs */
async function readTokens(store, key) {
  const raw = await store.get(key);
  if (!raw) return 0;
  try { return JSON.parse(raw).tokens || 0; } catch { return 0; }
}
async function writeTokens(store, key, tokens) {
  await store.set(key, JSON.stringify({ tokens }));
}

/**
 * Valida limites e já contabiliza o uso desta chamada.
 * Lança erro se estourar o limite do plano.
 *
 * @param {Object} args
 * @param {{id:string,email?:string}} args.user
 * @param {"basic"|"intermediate"|"premium"|string} args.plan
 * @param {string} args.model
 * @param {number} args.promptSize   // chars
 * @param {number} args.expectedOutputSize // tokens estimados de saída
 */
export async function guardAndBill({
  user,
  plan,
  model,
  promptSize = 0,
  expectedOutputSize = 800
}) {
  if (!user?.id) throw new Error("user.id obrigatório");

  const planKey = normalizePlan(plan);
  const caps = PLAN_CAPS[planKey];
  if (!caps) throw new Error(`Plano inválido: ${planKey}`);

  // Estimativa conservadora do custo desta chamada em tokens
  const tokensIn = charsToTokens(promptSize);
  const tokensOut = Math.max(0, expectedOutputSize || 0);
  const tokensThisCall = tokensIn + tokensOut;

  // Store de uso (namespace "usage")
  const store = await getStore("usage");

  // ----- Checagem/contagem DIÁRIA -----
  const dKey = dayKey(user.id);
  const usedToday = await readTokens(store, dKey);
  const newToday = usedToday + tokensThisCall;

  if (caps.limit_tokens_per_day && newToday > caps.limit_tokens_per_day) {
    const left = Math.max(0, caps.limit_tokens_per_day - usedToday);
    throw new Error(
      `Limite diário do plano ${planKey} atingido. Restante hoje: ${left} tokens.`
    );
  }

  // ----- Checagem/contagem MENSAL (se existir para o plano) -----
  if (caps.limit_tokens_per_month) {
    const mKey = monthKey(user.id);
    const usedThisMonth = await readTokens(store, mKey);
    const newMonth = usedThisMonth + tokensThisCall;

    if (newMonth > caps.limit_tokens_per_month) {
      const left = Math.max(0, caps.limit_tokens_per_month - usedThisMonth);
      throw new Error(
        `Limite mensal do plano ${planKey} atingido. Restante no mês: ${left} tokens.`
      );
    }

    // contabiliza mês
    await writeTokens(store, mKey, newMonth);
  }

  // contabiliza dia
  await writeTokens(store, dKey, newToday);

  // Se quiser, retorne dados úteis para log/debug
  return {
    ok: true,
    plan: planKey,
    model,
    tokens: { in: tokensIn, out: tokensOut, total: tokensThisCall },
    usage: { day: newToday }
  };
}
