// src/components/OwnerMenu.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useOwnerAccess } from "../hooks/useOwnerAccess.js";

export default function OwnerMenu() {
  const { isOwner } = useOwnerAccess();

  if (!isOwner) return null;

  return (
    <nav className="owner-menu">
      <Link to="/owner-dashboard" className="owner-menu-item">
        👑 Dashboard
      </Link>
      <Link to="/user-management" className="owner-menu-item">
        👥 Usuários
      </Link>
      <Link to="/change-password" className="owner-menu-item">
        🔑 Trocar Senha
      </Link>
    </nav>
  );
}
