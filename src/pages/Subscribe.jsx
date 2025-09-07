// src/pages/Subscribe.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Subscribe() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubscribe(planKey) {
    setLoading(true);
    setMsg("");

    try {
      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey: planKey }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erro desconhecido");

      // Redireciona o usuário para o Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setMsg(`Erro: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-6">
      <div className="max-w-2xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">Escolha seu plano</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <h2 className="font-semibold mb-2">Básico</h2>
            <p className="mb-4">R$ 14,90 / mês</p>
            <button
              onClick={() =>
                handleSubscribe("price_1S3RNLENxIkCT0yfu3UlZ7gM")
              }
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 px-3 py-2 rounded-lg font-semibold"
            >
              Assinar
            </button>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <h2 className="font-semibold mb-2">Intermediário</h2>
            <p className="mb-4">R$ 29,90 / mês</p>
            <button
              onClick={() =>
                handleSubscribe("price_1S3RPwENxIkCT0yfGUL2ae8N")
              }
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 px-3 py-2 rounded-lg font-semibold"
            >
              Assinar
            </button>
          </div>

          <div className="bg-gray-700 rounded-xl p-4 text-center">
            <h2 className="font-semibold mb-2">Premium</h2>
            <p className="mb-4">R$ 49,00 / mês</p>
            <button
              onClick={() =>
                handleSubscribe("price_1S3RSCENxIkCT0yf1pE1yLIQ")
              }
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-70 px-3 py-2 rounded-lg font-semibold"
            >
              Assinar
            </button>
          </div>
        </div>

        {msg && <p className="mt-6 text-center text-yellow-400">{msg}</p>}
      </div>
    </div>
  );
}
