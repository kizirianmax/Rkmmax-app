// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Pega variáveis de ambiente do Netlify/Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria cliente do Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
