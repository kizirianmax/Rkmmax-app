import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Plans from "./pages/Plans";
import "./index.css";

export default function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <nav className="nav container">
          <Link to="/" className="brand">RKMMAX</Link>
          <div className="nav-links">
            <Link to="/">Início</Link>
            <Link to="/agentes">Agentes</Link>
            <Link to="/planos">Planos</Link>
          </div>
        </nav>
      </header>

      <main className="container page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agentes" element={<Agents />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="footer">© 2025 RKMMAX</footer>
    </BrowserRouter>
  );
}
