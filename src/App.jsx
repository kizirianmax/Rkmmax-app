// src/App.jsx (mesmo arquivo, só o componente CheckoutSuccess)
import React, { useState } from "react";
import { Link } from "react-router-dom";

function CheckoutSuccess() {
  const [email, setEmail] = useState(
    () => window.localStorage.getItem("user_email") || ""
  );
  const save = () => {
    const v = email.trim().toLowerCase();
    if (v) {
      window.localStorage.setItem("user_email", v);
      alert("E-mail salvo! Agora você tem acesso Premium.");
    }
  };

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Assinatura criada!</h2>
      <p style={{ color: "#475569", marginBottom: 16 }}>
        Obrigado pelo apoio. Seu acesso Premium foi ativado.
      </p>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          type="email"
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ddd" }}
        />
        <button onClick={save} style={{ padding: "10px 16px", borderRadius: 12 }}>
          Salvar e-mail
        </button>
      </div>

      <Link
        to="/agents"
        style={{
          display: "inline-block",
          padding: "10px 16px",
          background: "#06b6d4",
          color: "#000",
          borderRadius: 12,
          fontWeight: 700,
          textDecoration: "none",
        }}
      >
        Acessar Especialistas
      </Link>
    </div>
  );
}
