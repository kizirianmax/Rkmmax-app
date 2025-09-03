// src/lib/supabaseClient.js

import { createClient } from "@supabase/supabase-js";

// Pega as variáveis do .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exporta como default (corrige o erro que apareceu no Bolt/Netlify)
export default supabase;
