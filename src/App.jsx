// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="page">
      <h1>RKMMAX</h1>
      <p>Bem-vindo! Escolha uma seção no topo.</p>
    </div>
  );
}

function Agents() {
  return (
    <div className="page">
      <h2>Agentes</h2>
      <p>Lista de especialistas em breve.</p>
    </div>
  );
}

function Plans() {
  return (
    <div className="page">
      <h2>Planos</h2>
      <p>Valores e recursos em breve.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <nav className="nav">
          <Link to="/">Início</Link>
          <Link to="/agents">Agentes</Link>
          <Link to="/plans">Planos</Link>
        </nav>
      </header>

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/plans" element={<Plans />} />
        </Routes>
      </main>

      <footer className="footer">
        <small>© {new Date().getFullYear()} RKMMAX</small>
      </footer>
    </BrowserRouter>
  );
}
