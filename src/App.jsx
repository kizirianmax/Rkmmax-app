// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";

import Header from "./components/Header";
import BrandTitle from "./components/BrandTitle";
import PlanGate from "./components/PlanGate";
import CrashSwitch from "./components/CrashSwitch"; // <-- TEMP: para testar ErrorBoundary

import Home from "./pages/Home";
import AgentsPage from "./pages/Agents";
import Pricing from "./pages/Pricing";

// página simples para retorno do Stripe (/success)
function CheckoutSuccess() {
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Assinatura criada!</h2>
      <p style={{ color: "#475569", marginBottom: 16 }}>
        Obrigado pelo apoio. Seu acesso Premium foi ativado.
      </p>
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

      {/* TEMP: força um crash quando acessar ?crash=1 (remover depois do teste) */}
      <CrashSwitch />

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

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
