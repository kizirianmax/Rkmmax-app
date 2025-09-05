// src/pages/Subscribe.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { supabase } from "../lib/supabaseClient";
import "../App.css";

/**
 * Este componente espera receber o parâmetro ?price=price_xxx na URL,
 * vindo da PlansScreen (cada botão/Plano envia um price_id).
 *
 * Ele chama a função serverless do Netlify:
 *   /.netlify/functions/create-checkout-session
 * que deve criar a sessão no Stripe e retornar { id } ou { url }.
 *
 * Variáveis necessárias no Netlify:
 * - VITE_STRIPE_PUBLISHABLE_KEY (frontend)
 * - STRIPE_SECRET_KEY (backend)
 * - STRIPE_WEBHOOK_SECRET (backend)
 */
export default function Subscribe() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [email, setEmail] = useState("");

  // Pega ?price= da URL
  const priceId = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return qs.get("price") || "";
  }, [location.search]);

  // Stripe publishable key (precisa ter prefixo VITE_ no Netlify pra aparecer no frontend)
  const stripePromise = useMemo(() => {
    const pk = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    return pk ? loadStripe(pk) : null;
  }, []);

  // Carrega email do usuário logado (se estiver autenticado)
  useEffect(() => {
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const userEmail = data?.user?.email || "";
        setEmail(userEmail);
      } catch {
        setEmail("");
      }
    })();
  }, []);

  async function startCheckout() {
    setErr("");
    if (!priceId) {
      setErr("Nenhum plano selecionado. Volte e escolha um plano.");
      return;
    }
    if (!stripePromise) {
      setErr("Stripe não configurado (VITE_STRIPE_PUBLISHABLE_KEY ausente).");
      return;
    }

    setLoading(true);
    try {
      const stripe = await stripePromise;

      const res = await fetch("/.netlify/functions/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          // URLs para onde o Stripe deve redirecionar (success/cancel)
          successUrl: `${window.location.origin}/account`,
          cancelUrl: `${window.location.origin}/plans`,
          customerEmail: email || undefined,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Falha ao criar sessão de checkout.");
      }

      const data = await res.json();

      // Dois formatos comuns: { url } ou { id } (sessionId)
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      if (data?.id && stripe?.redirectToCheckout) {
        const { error } = await stripe.redirectToCheckout({ sessionId: data.id });
        if (error) throw error;
        return;
      }

      throw new Error("Resposta inesperada do servidor de checkout.");
    } catch (e) {
      setErr(e?.message || "Erro ao iniciar checkout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Confirmar Assinatura</h1>

      {!priceId ? (
        <>
          <p>Nenhum plano foi selecionado.</p>
          <Link to="/plans" className="btn">Voltar aos planos</Link>
        </>
      ) : (
        <div className="card" style={{ maxWidth: 520 }}>
          <p><strong>Plano selecionado:</strong> <code>{priceId}</code></p>
          {email ? (
            <p><strong>E-mail:</strong> {email}</p>
          ) : (
            <p className="muted">
              (Você pode fazer login antes para associar sua assinatura)
            </p>
          )}

          {err && <p className="error" style={{ marginTop: 8 }}>{err}</p>}

          <div style={{ marginTop: 16, display: "flex", gap: 12 }}>
            <button className="btn" onClick={startCheckout} disabled={loading}>
              {loading ? "Redirecionando..." : "Assinar agora"}
            </button>
            <Link to="/plans" className="btn btn-secondary">Trocar plano</Link>
          </div>

          <p className="muted" style={{ marginTop: 12 }}>
            Ao continuar, você será redirecionado para o ambiente seguro do Stripe.
          </p>
        </div>
      )}
    </div>
  );
}
