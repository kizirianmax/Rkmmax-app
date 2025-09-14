// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Chat from "./pages/Chat";
import AppInfo from "./pages/AppInfo";
import PricingTable from "./components/PricingTable";

function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 16,
        padding: "12px 16px",
        background: "rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "#e6eef5", fontWeight: 700 }}>
        RKMMAX
      </Link>

      <div style={{ flex: 1 }} />

      <Link to="/agents" style={{ textDecoration: "none", color: "#e6eef5" }}>
        Agentes
      </Link>

      <Link to="/info" style={{ textDecoration: "none", color: "#e6eef5" }}>
        Info
      </Link>

      <Link to="/pricing" style={{ textDecoration: "none", color: "#e6eef5" }}>
        Planos
      </Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/info" element={<AppInfo />} />
        <Route path="/pricing" element={<PricingTable />} />
      </Routes>
    </Router>
  );
}
