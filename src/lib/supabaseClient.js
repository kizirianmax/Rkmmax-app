// src/lib/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// As variáveis vêm do Netlify (.env configurado)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Cria o cliente do Supabase
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Exporta como default (forma mais simples de usar)
export default supabase;