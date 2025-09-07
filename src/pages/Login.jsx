// src/pages/Login.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    setLoading(false);

    if (error) {
      setMsg(`Erro: ${error.message}`);
      return;
    }

    // sucesso
    setMsg("Login realizado com sucesso!");
    // redireciona se quiser:
    // window.location.href = "/account";
  }

  async function handleMagicLink(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({ email });

    setLoading(false);

    if (error) setMsg(`Erro: ${error.message}`);
    else setMsg("Enviamos um link mágico para seu e-mail!");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Entrar</h1>
        <p className="text-center text-gray-300 mb-6">
          Acesse sua conta do RKMMAX
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm text-gray-300">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="voce@email.com"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Senha</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
              className="w-full mt-1 px-3 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring focus:ring-indigo-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 px-3 py-2 rounded-lg font-semibold"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>

          <button
            onClick={handleMagicLink}
            disabled={loading || !email}
            className="w-full bg-gray-700 hover:bg-gray-600 disabled:opacity-60 px-3 py-2 rounded-lg font-semibold"
          >
            Enviar link mágico
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-yellow-400">{msg}</p>}

        <div className="mt-6 text-sm text-center text-gray-300">
          Não tem conta?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Criar conta
          </Link>
        </div>
      </div>
    </div>
  );
}
