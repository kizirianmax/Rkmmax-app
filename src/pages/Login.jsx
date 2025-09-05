import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
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

      if (error) {
        setErrorMsg(error.message || "Falha no login.");
      } else if (data?.user) {
        // redireciona após login
        navigate("/account");
      } else {
        setErrorMsg("Não foi possível autenticar. Tente novamente.");
      }
    } catch (err) {
      setErrorMsg("Erro inesperado. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Entrar</h1>

      <form onSubmit={handleSubmit} className="card">
        <label>
          E-mail
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label>
          Senha
          <input
            type="password"
            placeholder="Sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </label>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <div className="muted">
        <Link to="/reset-password">Esqueci minha senha</Link>
        {" · "}
        <Link to="/signup">Criar conta</Link>
      </div>
    </div>
  );
}
