import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,      // mantém sessão no device
    autoRefreshToken: true,    // renova tokens automaticamente
    detectSessionInUrl: true,  // lida com retorno do OAuth
  },
});
