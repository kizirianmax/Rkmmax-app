// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./../App.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg("❌ Erro: " + error.message);
    } else {
      setMsg("✅ Login realizado com sucesso!");
      navigate("/plans");
    }
  }

  return (
    <div className="container">
      <h2>🔑 Login</h2>
      <form onSubmit={handleLogin} className="form">
        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input"
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input"
        />
        <button type="submit" className="button" disabled={loading}>
          {loading ? "Carregando..." : "Entrar"}
        </button>
      </form>

      {msg && <p className="message">{msg}</p>}

      <p>
        Não tem conta?{" "}
        <Link to="/signup" className="link">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
