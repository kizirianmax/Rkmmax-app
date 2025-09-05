
// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Variáveis de ambiente (configure no Netlify também)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
