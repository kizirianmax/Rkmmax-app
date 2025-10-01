// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// CRA usa process.env com prefixo REACT_APP_
const supabaseUrl     = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase: variáveis de ambiente ausentes.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
