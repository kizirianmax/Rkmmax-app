// /netlify/functions/_usage.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // use sempre a chave SERVICE ROLE no server
);

// Retorna o uso atual (diário + mensal GPT-5)
export async function getUsage(userId) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const month = new Date().toISOString().slice(0, 7);  // YYYY-MM

  const [{ data: daily }, { data: monthly5 }] = await Promise.all([
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
    dailyTokens: daily?.tokens || 0,
    monthly5Tokens: monthly5?.tokens || 0,
  };
}

// Atualiza uso após cada chamada
export async function setUsage(userId, { dailyTokens, monthly5Tokens }) {
  const today = new Date().toISOString().slice(0, 10);
  const month = new Date().toISOString().slice(0, 7);

  // UPSERT no uso diário
  await supabase.from("usage_daily").upsert(
    {
      user_id: userId,
      date: today,
      tokens: dailyTokens,
    },
    { onConflict: ["user_id", "date"] }
  );

  // UPSERT no uso mensal do GPT-5
  await supabase.from("usage_monthly_5").upsert(
    {
      user_id: userId,
      month,
      tokens: monthly5Tokens,
    },
    { onConflict: ["user_id", "month"] }
  );
}
