// src/auth/AuthGate.jsx
import React, { useEffect, useState } from "react";
import { Navigate, useLocation, matchPath } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";
import supabase from "../lib/supabaseClient.js";

// Rotas que NÃO exigem login
const PUBLIC_ROUTES = [
  "/",
  "/plans",
  "/pricing",
  "/login",
  "/signup",
  "/reset-password",
  "/auth/github/callback",
  "/terms",
  "/privacy",
  "/regulamento",
  "/refund",
  "/info",
  "/app-info",
  "/help"
];

function isPublic(pathname) {
  return PUBLIC_ROUTES.some((pattern) => matchPath({ path: pattern, end: true }, pathname));
}

export default function AuthGate({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth();
  const [validatingSession, setValidatingSession] = useState(false);

  // ✅ VALIDAÇÃO ADICIONAL DE SESSÃO PARA ROTAS PRIVADAS
  useEffect(() => {
    const validateSession = async () => {
      // Apenas valida se não for rota pública e tiver usuário
      if (!isPublic(location.pathname) && user) {
        setValidatingSession(true);
        
        try {
          const { data: { session }, error } = await supabase.auth.getSession();
          
          // ✅ Se não houver sessão válida, força logout
          if (error || !session) {
            console.warn("Sessão inválida detectada, fazendo logout...");
            await supabase.auth.signOut();
            window.location.href = "/login";
          }
        } catch (err) {
          console.error("Erro ao validar sessão:", err);
          await supabase.auth.signOut();
          window.location.href = "/login";
        } finally {
          setValidatingSession(false);
        }
      }
    };

    validateSession();
  }, [location.pathname, user]);

  // Enquanto checa o estado de auth (evita flicker/redirecionamento precoce)
  if (loading || validatingSession) {
    return (
      <div style={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <span style={{ opacity: 0.7 }}>Carregando…</span>
      </div>
    );
  }

  // Se a rota é pública, sempre libera
  if (isPublic(location.pathname)) {
    return <>{children}</>;
  }

  // ✅ Se a rota é privada e não tem usuário autenticado, manda para login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // ✅ Autenticado em rota privada com sessão válida
  return <>{children}</>;
}
