// /netlify/functions/_usage.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use a SERVICE ROLE no server
);

// Retorna o uso do dia (todos os modelos) e o uso mensal só do GPT-5
export async function getUsage(userId) {
  const today = new Date().toISOString().slice(0, 10);         // YYYY-MM-DD
  const month = new Date().toISOString().slice(0, 7);           // YYYY-MM

  const [{ data: d1 }, { data: d2 }] = await Promise.all([
    supabase
      .from("usage_daily")
      .select("tokens")
      .eq("user_id", userId)
      .eq("date", today)
      .single(),
    supabase
      .from("usage_monthly_5")
      .select("tokens")
      .eq("user_id", userId)
      .eq("month", month)
      .single(),
  ]);

  return {
    dailyTokens: d1?.tokens ?? 0,
    monthly5Tokens: d2?.tokens ?? 0,
  };
}

export async function addUsage(userId, { addDailyTokens = 0, addMonthly5Tokens = 0 }) {
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);

  // upsert diário
  await supabase
    .from("usage_daily")
    .upsert({ user_id: userId, date: today, tokens: addDailyTokens }, { onConflict: "user_id,date", ignoreDuplicates: false })
    .select();

  // incrementa (atomicamente) os valores
  await supabase.rpc("increment_daily_usage", { p_user_id: userId, p_date: today, p_add: addDailyTokens });

  if (addMonthly5Tokens > 0) {
    await supabase
      .from("usage_monthly_5")
      .upsert({ user_id: userId, month: month, tokens: addMonthly5Tokens }, { onConflict: "user_id,month", ignoreDuplicates: false })
      .select();

    await supabase.rpc("increment_monthly5_usage", { p_user_id: userId, p_month: month, p_add: addMonthly5Tokens });
  }
}
