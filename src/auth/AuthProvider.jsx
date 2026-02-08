// src/auth/AuthProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient.js"; // ✅ default import
import { isOwner } from "../config/roles.js";
import { applyAccessConfig } from "../middleware/authMiddleware.js";

const AuthContext = createContext({
  user: null,
  loading: true,
  signIn: () => {},
  signOut: () => {},
  isOwner: false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const sessionUser = session?.user ?? null;
      
      // Aplica configurações de acesso
      const userWithConfig = applyAccessConfig(sessionUser);
      setUser(userWithConfig);
      setLoading(false);
    };
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const sessionUser = session?.user ?? null;
        const userWithConfig = applyAccessConfig(sessionUser);
        setUser(userWithConfig);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Aplica configurações de acesso
      const userWithConfig = applyAccessConfig(data.user);
      setUser(userWithConfig);

      return { data: userWithConfig, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signOut,
      isOwner: isOwner(user)
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
