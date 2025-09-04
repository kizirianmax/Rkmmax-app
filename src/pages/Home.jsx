// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./../App.css"; // garante que o estilo global seja aplicado

export default function Home() {
  return (
    <div className="container">
      <h1>🚀 Bem-vindo ao RKMMax</h1>
      <p>Seu sistema modular de inteligência artificial.</p>

      <div className="button-group">
        <Link to="/login">
          <button className="button">Entrar</button>
        </Link>
        <Link to="/signup">
          <button className="button">Cadastrar</button>
        </Link>
        <Link to="/plans">
          <button className="button">Ver Planos</button>
        </Link>
      </div>
    </div>
  );
}
