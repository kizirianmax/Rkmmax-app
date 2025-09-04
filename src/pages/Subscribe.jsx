// src/pages/Subscribe.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Subscribe() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  // Garante que só usuário logado assina
  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data?.session?.user;
      if (!user) {
        navigate("/login");
      } else {
        setEmail(user.email || "");
      }
    };
    run();
  }, [navigate]);

  const handleCheckout = async (priceId) => {
    try {
      setLoading(true);
      setMsg("");

      const res = await fetch("/.netlify/functions/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId, email }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Falha ao iniciar checkout");
      }

      const { url } = await res.json();
      if (url) {
        window.location.href = url; // redireciona pro Stripe Checkout
      } else {
        throw new Error("URL de checkout não recebida");
      }
    } catch (e) {
      console.error(e);
      setMsg("Não foi possível abrir o pagamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Assine um plano</h1>
      <p className="muted">
        Sua conta: <strong>{email}</strong>
      </p>

      {msg && <div className="alert alert-error">{msg}</div>}

      <div className="card-grid">
        <div className="card">
          <h2>Plano Mensal</h2>
          <p className="price">R$ 19,90 / mês</p>
          <ul className="list">
            <li>Acesso completo</li>
            <li>Suporte padrão</li>
          </ul>
          <button
            className="btn btn-primary"
            disabled={loading}
            onClick={() => handleCheckout("PRICE_ID_MENSAL")}
          >
            {loading ? "Abrindo..." : "Assinar mensal"}
          </button>
        </div>

        <div className="card">
          <h2>Plano Anual</h2>
          <p className="price">R$ 199,00 / ano</p>
          <ul className="list">
            <li>Acesso completo</li>
            <li>Suporte prioritário</li>
          </ul>
          <button
            className="btn btn-secondary"
            disabled={loading}
            onClick={() => handleCheckout("PRICE_ID_ANUAL")}
          >
            {loading ? "Abrindo..." : "Assinar anual"}
          </button>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <button className="btn" onClick={() => navigate("/")}>
          ← Voltar para Home
        </button>
      </div>
    </div>
  );
}
