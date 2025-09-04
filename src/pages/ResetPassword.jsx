// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient.js";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [pass1, setPass1] = useState("");
  const [pass2, setPass2] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");

    if (pass1.length < 6) {
      setMsg("A nova senha precisa ter pelo menos 6 caracteres.");
      return;
    }

    if (pass1 !== pass2) {
      setMsg("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: pass1,
    });

    setLoading(false);

    if (error) {
      setMsg(error.message);
    } else {
      setMsg("Senha alterada com sucesso!");
      navigate("/login");
    }
  }

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Redefinir Senha</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="password"
          placeholder="Nova senha"
          className="w-full border p-2 rounded"
          value={pass1}
          onChange={(e) => setPass1(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirme a nova senha"
          className="w-full border p-2 rounded"
          value={pass2}
          onChange={(e) => setPass2(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Alterando..." : "Alterar senha"}
        </button>
      </form>
      {msg && <p className="mt-3 text-red-600">{msg}</p>}
    </main>
  );
}
