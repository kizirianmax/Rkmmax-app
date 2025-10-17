// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { initSentry } from "./lib/sentry.js";
import { initAnalytics } from "./lib/analytics.js";
import FeedbackButton from "./components/FeedbackButton.jsx";

import Header from "./components/Header.jsx";
import BrandTitle from "./components/BrandTitle.jsx";
import PlanGate from "./components/PlanGate.jsx";

import Home from "./pages/Home.jsx";
import Serginho from "./pages/Serginho.jsx";
import AgentsPage from "./pages/Agents.jsx";
import Projects from "./pages/Projects.jsx";
import StudyLab from "./pages/StudyLab.jsx";
import Pricing from "./pages/Pricing.jsx";
import Help from "./pages/Help.jsx";

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
  useEffect(() => {
    // Initialize observability tools
    initSentry();
    initAnalytics();
  }, []);

  return (
    <BrowserRouter>
      <BrandTitle />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/serginho" element={<Serginho />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/study" element={<StudyLab />} />
        <Route path="/study-lab" element={<Navigate to="/study" replace />} />

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
        <Route path="/plans" element={<Navigate to="/pricing" replace />} />

        {/* Sucesso do Stripe */}
        <Route path="/success" element={<CheckoutSuccess />} />

        {/* Help & Status */}
        <Route path="/help" element={<Help />} />
        <Route path="/status" element={<Help />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Feedback Button */}
      <FeedbackButton />
    </BrowserRouter>
  );
}
