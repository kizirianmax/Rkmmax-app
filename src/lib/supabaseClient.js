// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Pega as variáveis do ambiente (Netlify / Vite / Bolt)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Checagem de segurança: alerta se variáveis não estiverem configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase URL ou Anon Key não configurados!");
  console.error("Verifique as variáveis de ambiente no Netlify/Bolt:");
  console.error("VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
