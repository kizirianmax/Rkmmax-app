import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../App.css";

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message || "Erro ao criar conta.");
      } else if (data?.user) {
        setSuccessMsg("Conta criada! Verifique seu e-mail para confirmar.");
        // redireciona para login após cadastro
        setTimeout(() => navigate("/login"), 2500);
      } else {
        setErrorMsg("Não foi possível criar sua conta.");
      }
    } catch (err) {
      setErrorMsg("Erro inesperado. " + (err?.message || ""));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Criar Conta</h1>

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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </label>

        {errorMsg && <p className="error">{errorMsg}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Criando..." : "Criar conta"}
        </button>
      </form>

      <div className="muted">
        Já tem conta? <Link to="/login">Entrar</Link>
      </div>
    </div>
  );
}
