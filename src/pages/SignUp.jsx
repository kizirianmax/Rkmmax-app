// src/pages/SignUp.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./../App.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setMsg("❌ Erro: " + error.message);
    } else {
      setMsg("✅ Cadastro realizado com sucesso! Verifique seu e-mail.");
      navigate("/login");
    }
  }

  return (
    <div className="container">
      <h2>📝 Criar Conta</h2>
      <form onSubmit={handleSignUp} className="form">
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
          {loading ? "Carregando..." : "Cadastrar"}
        </button>
      </form>

      {msg && <p className="message">{msg}</p>}

      <p>
        Já tem conta?{" "}
        <Link to="/login" className="link">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
