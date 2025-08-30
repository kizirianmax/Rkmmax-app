import React from "react";
import { useAuth } from "./AuthProvider";
import Auth from "../pages/Auth.jsx";

export default function AuthGate({ children }) {
  const { session, isGuest } = useAuth();

  // Se tem usuário logado OU entrou como convidado → libera
  if (session?.user || isGuest()) return children;

  // Senão, mostra a tela de login/cadastro
  return <Auth />;
}
