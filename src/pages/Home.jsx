// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

export default function Home() {
  return (
    <div className="container">
      <h1 className="title">Bem-vindo ao RKMMAX 🚀</h1>
      <p className="subtitle">
        Escolha sua opção abaixo e comece a usar nossa IA com assinatura segura via Stripe.
      </p>

      <div className="grid">
        <div className="card">
          <h2>🔑 Login</h2>
          <p>Já tem conta? Entre agora.</p>
          <Link to="/login" className="btn">Entrar</Link>
        </div>

        <div className="card">
          <h2>📝 Criar Conta</h2>
          <p>Novo aqui? Crie sua conta gratuita.</p>
          <Link to="/signup" className="btn">Cadastrar</Link>
        </div>

        <div className="card">
          <h2>💳 Planos</h2>
          <p>Veja os planos disponíveis e escolha o ideal.</p>
          <Link to="/plans" className="btn">Ver Planos</Link>
        </div>
      </div>
    </div>
  );
}
