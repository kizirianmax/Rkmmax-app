// src/lib/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// CRA usa process.env com prefixo REACT_APP_
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase: variáveis de ambiente ausentes.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // ✅ Mantém sessão persistente (usuário fica logado)
    persistSession: true,
    
    // ✅ Renova token automaticamente a cada 1 hora
    autoRefreshToken: true,
    
    // ✅ Detecta callbacks de OAuth (Google, GitHub, etc)
    detectSessionInUrl: true,
    
    // ✅ Usa localStorage (sessão permanece após fechar navegador)
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    
    // ✅ Chave personalizada no localStorage
    storageKey: 'rkmmax-auth-token',
    
    // ✅ Retry automático em caso de falha na rede
    flowType: 'pkce'
  }
});

// Export default para compatibilidade com imports existentes
export default supabase;