// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // << CORRIGIDO: named import
import "../App.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // login OK -> manda para a home (ajuste a rota se quiser)
      if (data?.user) navigate("/");
    } catch (err) {
      setErrorMsg(err.message || "Falha no login. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Entrar</h1>

        <form onSubmit={handleSubmit} className="auth-form">
          <label className="auth-label">
            E-mail
            <input
              type="email"
              className="auth-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              required
            />
          </label>

          <label className="auth-label">
            Senha
            <input
              type="password"
              className="auth-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/reset-password">Esqueci minha senha</Link>
          <span>•</span>
          <Link to="/signup">Criar conta</Link>
        </div>
      </div>
    </div>
  );
}
