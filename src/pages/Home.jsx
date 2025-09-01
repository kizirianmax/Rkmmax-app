// src/pages/Home.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthProvider";

export default function Home() {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
        <h2>Carregando…</h2>
      </main>
    );
  }

  // Visitante (não logado)
  if (!user) {
    return (
      <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
        <h1>Bem-vindo ao RKMMAX 🚀</h1>
        <p>Crie sua conta ou entre para usar os agentes.</p>

        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <Link to="/login" style={btn()}>Entrar</Link>
          <Link to="/plans" style={btn("outline")}>Ver planos</Link>
        </div>
      </main>
    );
  }

  // Usuário logado
  return (
    <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      <h1>Olá, {user.email || "usuário"} 😎</h1>
      <p>Escolha para onde ir:</p>

      <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
        <button onClick={() => navigate("/agents")} style={btn()}>
          Ver agentes
        </button>
        <button onClick={() => navigate("/plans")} style={btn("outline")}>
          Planos e preços
        </button>
        <button onClick={signOut} style={btn("danger")}>
          Sair
        </button>
      </div>
    </main>
  );
}

function btn(variant = "primary") {
  const base = {
    padding: "10px 16px",
    borderRadius: 8,
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    textDecoration: "none",
    display: "inline-block",
  };
  if (variant === "outline") {
    return { ...base, background: "transparent", color: "#2563eb" };
  }
  if (variant === "danger") {
    return { ...base, background: "#ef4444", borderColor: "#ef4444" };
  }
  return base;
}
