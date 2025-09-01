// src/auth/AuthGate.jsx
import React from "react";
import { Navigate, useLocation, matchPath } from "react-router-dom";
// IMPORTANTE: seu AuthProvider deve expor o hook useAuth.
// Se no seu projeto for diferente, ajuste a importação abaixo.
import { useAuth } from "./AuthProvider";

// Rotas que NÃO exigem login
const PUBLIC_ROUTES = ["/", "/plans", "/login", "/reset-password"];

function isPublic(pathname) {
  return PUBLIC_ROUTES.some((pattern) => matchPath({ path: pattern, end: true }, pathname));
}

export default function AuthGate({ children }) {
  const location = useLocation();
  const { user, loading } = useAuth(); // { user: objeto|null, loading: boolean }

  // Enquanto checa o estado de auth (evita flicker/redireciono precoce)
  if (loading) {
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

  // Se a rota é privada e não tem usuário autenticado, manda para login
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Autenticado em rota privada
  return <>{children}</>;
}
