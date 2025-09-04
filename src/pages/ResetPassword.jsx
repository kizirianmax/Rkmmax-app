import React, { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./../App.css";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const redirectTo = `${window.location.origin}/auth`; // rota que definirá a nova senha

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    setLoading(false);

    if (error) {
      setMsg("❌ Erro: " + error.message);
    } else {
      setMsg("✅ Enviamos um e-mail com o link para redefinir sua senha.");
    }
  }

  return (
    <div className="container">
      <h2>🔑 Esqueci minha senha</h2>

      <form onSubmit={handleReset} className="form">
        <input
          type="email"
          className="input"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" className="button" disabled={loading}>
          {loading ? "Enviando..." : "Enviar link de redefinição"}
        </button>
      </form>

      {msg && <p className="message">{msg}</p>}

      <p>
        Lembrou a senha?{" "}
        <Link to="/login" className="link">
          Fazer login
        </Link>
      </p>
    </div>
  );
}
