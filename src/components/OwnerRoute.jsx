// src/components/OwnerRoute.jsx
// Componente para proteger rotas que só o owner pode acessar

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider.jsx";
import { isOwner } from "../config/roles.js";

export default function OwnerRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Carregando...</p>
      </div>
    );
  }

  if (!isOwner(user)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
