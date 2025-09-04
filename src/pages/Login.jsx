// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../lib/supabaseClient.js";  // ✅ corrigido: default import + extensão .js

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

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
      setMsg(error.message);
    } else {
      navigate("/"); // login ok → redireciona para Home
    }
  }

  async function handleResetPassword() {
    setMsg("");
    if (!email) {
      setMsg("Digite seu e-mail acima para redefinir a senha.");
      return;
    }

    const redirectTo = `${window.location.origin}/reset`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) setMsg(error.message);
    else setMsg("Enviamos um e-mail com o link para redefinir a senha.");
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Entrar</h1>

      <form onSubmit={handleLogin} className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <button
        onClick={handleResetPassword}
        className="mt-4 text-blue-600 underline"
      >
        Esqueci minha senha
      </button>

      <p className="mt-2 text-sm">
        Não tem conta? <Link to="/auth" className="text-blue-600 underline">Cadastre-se</Link>
      </p>

      {msg && <p className="mt-3 text-red-600">{msg}</p>}
    </main>
  );
}
