// src/lib/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

// As variáveis vêm do Netlify (Environment Variables)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Supabase URL ou Anon Key não estão definidos nas variáveis de ambiente.");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
