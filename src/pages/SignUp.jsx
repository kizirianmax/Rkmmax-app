// src/pages/SignUp.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSignUp(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
    });

    setLoading(false);

    if (error) {
      setMsg(`Erro: ${error.message}`);
    } else {
      setMsg("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-md bg-gray-800 border border-gray-700 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-2">Criar Conta</h1>
        <p className="text-center text-gray-300 mb-6">
          Comece a usar o RKMMAX em poucos segundos
        </p>

        <form onSubmit={handleSignUp} className="space-y-4">
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
            className="w-full bg-green-600 hover:bg-green-500 disabled:opacity-70 px-3 py-2 rounded-lg font-semibold"
          >
            {loading ? "Cadastrando..." : "Criar Conta"}
          </button>
        </form>

        {msg && <p className="mt-4 text-center text-yellow-400">{msg}</p>}

        <div className="mt-6 text-sm text-center text-gray-300">
          Já tem conta?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}
