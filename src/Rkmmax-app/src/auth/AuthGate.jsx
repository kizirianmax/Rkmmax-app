import React from "react";
import { useAuth } from "./AuthProvider";
import Login from "../pages/Login";

export default function AuthGate({ children }) {
  const { session, isGuest } = useAuth();

  // Se tem sessão real OU entrou como convidado → libera
  if (session?.user || isGuest()) return children;

  // Senão, mostra tela de login
  return <Login />;
}
