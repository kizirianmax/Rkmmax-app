import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "../App.css";

/**
 * Fluxos:
 * - Modo "request": usuário informa e-mail e recebe link de recuperação.
 * - Modo "update": usuário chegou por link do Supabase (type=recovery) e define nova senha.
 */
export default function ResetPassword() {
  const navigate = useNavigate();

  const [mode, setMode] = useState("request"); // "request" | "update"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  // Detecta se veio do link de recuperação do Supabase
  useEffect(() => {
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    const qp = new URLSearchParams((hash.startsWith("#") ? hash.slice(1) : hash) || search);
    if ((qp.get("type") || "").toLowerCase() === "recovery") {
      setMode("update");
    }
  }, []);

  async function sendResetEmail(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    setLoading(true);
    try {
      // Para onde o Supabase vai redirecionar após o clique no e-mail:
      const redirectTo = `${window.location.origin}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      });
      if (error) throw error;
      setMsg("Enviamos um link de recuperação para o seu e-mail.");
    } catch (error) {
      setErr(error?.message || "Não foi possível enviar o e-mail de recuperação.");
    } finally {
      setLoading(false);
    }
  }

  async function updatePassword(e) {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (password.length < 6) {
      setErr("A senha precisa ter ao menos 6 caracteres.");
      return;
    }
    if (password !== password2) {
      setErr("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMsg("Senha atualizada com sucesso! Redirecionando para o login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setErr(error?.message || "Não foi possível atualizar a senha.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      {mode === "request" ? (
        <>
          <h1>Recuperar senha</h1>
          <form onSubmit={sendResetEmail} className="card">
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

            {err && <p className="error">{err}</p>}
            {msg && <p className="success">{msg}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Enviando..." : "Enviar link de recuperação"}
            </button>
          </form>

          <div className="muted">
            Lembrou a senha? <Link to="/login">Voltar para o login</Link>
          </div>
        </>
      ) : (
        <>
          <h1>Definir nova senha</h1>
          <form onSubmit={updatePassword} className="card">
            <label>
              Nova senha
              <input
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>

            <label>
              Confirmar nova senha
              <input
                type="password"
                placeholder="Repita a nova senha"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                required
                autoComplete="new-password"
              />
            </label>

            {err && <p className="error">{err}</p>}
            {msg && <p className="success">{msg}</p>}

            <button type="submit" disabled={loading}>
              {loading ? "Atualizando..." : "Atualizar senha"}
            </button>
          </form>

          <div className="muted">
            Não era isso? <Link to="/login">Voltar para o login</Link>
          </div>
        </>
      )}
    </div>
  );
}
