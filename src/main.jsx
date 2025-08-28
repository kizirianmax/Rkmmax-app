import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Agents from "./pages/Agents.jsx";
import AgentDetail from "./pages/AgentDetail.jsx";
import "../styles.css";

export default function App() {
  return (
    <BrowserRouter>
      <header className="nav">
        <div className="container nav__row">
          <Link to="/" className="brand">RKMMAX</Link>
          <nav className="nav__links">
            <Link to="/">Agentes</Link>
          </nav>
        </div>
      </header>

      <main className="container" style={{ paddingTop: "96px" }}>
        <Routes>
          <Route path="/" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
        </Routes>
      </main>

      <footer style={{ textAlign: "center", padding: "40px 0" }}>
        © {new Date().getFullYear()} RKMMAX
      </footer>
    </BrowserRouter>
  );
}
