// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

import Agents from "./pages/Agents";            // ✅ default export
import AgentDetails from "./pages/AgentDetails"; // ✅ nova página de detalhes

function Navbar() {
  return (
    <nav style={{
      display: "flex", gap: 16, padding: "12px 16px",
      background: "rgba(255,255,255,0.06)", borderBottom: "1px solid rgba(255,255,255,0.08)"
    }}>
      <Link to="/" style={{ textDecoration: "none", color: "#e6eef5", fontWeight: 700 }}>RKMMax</Link>
      <div style={{ flex: 1 }} />
      <Link to="/agents" style={{ textDecoration: "none", color: "#e6eef5" }}>Agentes</Link>
    </nav>
  );
}

function Home() {
  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <h1 style={{ marginBottom: "0.5rem", color: "#15d0d4" }}>Bem-vindo 👋</h1>
      <p>Use o menu acima para acessar a lista de agentes.</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <h1 style={{ color: "#ff6b6b" }}>404</h1>
      <p>Página não encontrada.</p>
      <Link to="/agents" style={{ color: "#15d0d4" }}>Ver agentes</Link>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0f172a,#0b1220)" }}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agent/:id" element={<AgentDetails />} />
          {/* redireciona antigos caminhos, se precisar */}
          <Route path="/agentes" element={<Navigate to="/agents" replace />} />
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}
