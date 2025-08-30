import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

// Contexto de autenticação
const AuthCtx = createContext();

// Hook para usar o contexto em qualquer componente
export function useAuth() {
  return useContext(AuthCtx);
}

export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pega sessão atual
    const currentSession = supabase.auth.session();
    setSession(currentSession);
    setLoading(false);

    // Escuta mudanças na sessão
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      listener?.unsubscribe();
    };
  }, []);

  // Usuário não logado → tratamos como convidado
  function isGuest() {
    return !session?.user;
  }

  const value = { session, isGuest };

  return (
    <AuthCtx.Provider value={value}>
      {loading ? <div style={{ padding: 24 }}>Carregando...</div> : children}
    </AuthCtx.Provider>
  );
}
