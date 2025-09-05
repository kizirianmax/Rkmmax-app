// src/pages/Auth.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

/**
 * RequireAuth protege as rotas filhas.
 * Se não tiver sessão => manda pro /login mantendo "from" para redirecionar depois.
 */
export function RequireAuth() {
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let unsub;

    (async () => {
      // 1) checa sessão atual
      const { data } = await supabase.auth.getSession();
      setIsAuth(!!data?.session);
      setChecking(false);

      // 2) escuta mudanças (login/logout)
      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuth(!!session);
      });
      unsub = () => sub.data.subscription.unsubscribe();
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600">Verificando sessão...</p>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

/**
 * Optional: componente que redireciona *para dentro* se já estiver logado.
 * Útil em /login e /signup para não mostrar formulário a quem já tem sessão.
 */
export function RedirectIfAuthed({ to = "/account", children = null }) {
  const [checking, setChecking] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    let unsub;

    (async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuth(!!data?.session);
      setChecking(false);

      const sub = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuth(!!session);
      });
      unsub = () => sub.data.subscription.unsubscribe();
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  if (checking) {
    return null;
  }

  if (isAuth) {
    return <Navigate to={to} replace />;
  }

  return children;
}

export default RequireAuth;
