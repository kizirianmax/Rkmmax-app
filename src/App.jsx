// src/App.jsx
import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Header from "./components/Header";
import BrandTitle from "./components/BrandTitle";
import PlanGate from "./components/PlanGate";

import Home from "./pages/Home";
import AgentsPage from "./pages/Agents";
import Pricing from "./pages/Pricing";
import Debug from "./pages/Debug";

// Página simples para retorno do Stripe (/success)
function CheckoutSuccess() {
  const [email, setEmail] = useState(
    () =>
      (typeof window !== "undefined" &&
        window.localStorage.getItem("user_email")) ||
      ""
  );

  const save = () => {
    if (typeof window === "undefined") return;
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

export default function App() {
  return (
    <BrowserRouter>
      {/* Título da aba baseado na marca */}
      <BrandTitle />

      {/* Navegação */}
      <Header />

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Área Premium */}
        <Route
          path="/agents"
          element={
            <PlanGate requirePlan="premium">
              <AgentsPage />
            </PlanGate>
          }
        />

        {/* Planos */}
        <Route path="/pricing" element={<Pricing />} />
        {/* alias antigo */}
        <Route path="/plans" element={<Navigate to="/pricing" replace />} />

        {/* Sucesso do Stripe */}
        <Route path="/success" element={<CheckoutSuccess />} />

        {/* Debug (pode remover quando quiser) */}
        <Route path="/debug" element={<Debug />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
