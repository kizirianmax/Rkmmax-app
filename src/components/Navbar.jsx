// src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // opcional se quiser separar estilos

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">RKMMax</Link>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/">Início</Link>
        </li>
        <li>
          <Link to="/agentes">Agentes</Link>
        </li>
        <li>
          <Link to="/info">Info</Link>
        </li>
        <li>
          <Link to="/planos">Planos</Link>
        </li>
      </ul>
      <div className="navbar-actions">
        <Link to="/login" className="btn-login">
          Entrar
        </Link>
        <Link to="/signup" className="btn-signup">
          Cadastrar
        </Link>
      </div>
    </nav>
  );
}
