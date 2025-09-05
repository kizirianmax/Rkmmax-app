// src/pages/Account.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import supabase from "../lib/supabaseClient";

export default function Account() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // carrega usuário logado; se não houver, manda para /login
  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      }

      const currentUser = data?.user ?? null;
      if (!currentUser) {
        navigate("/login", { replace: true });
      } else if (isMounted) {
        setUser(currentUser);
      }
      setLoading(false);
    }

    loadUser();

    // também escuta mudanças de sessão (login/logout)
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (!u) navigate("/login", { replace: true });
    });

    return () => {
      isMounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, [navigate]);

  async function handleLogout() {
    try {
      await supabase.auth.signOut();
      navigate("/login", { replace: true });
    } catch (e) {
      console.error(e);
      alert("Não foi possível sair. Tente novamente.");
    }
  }

  // enquanto carrega
  if (loading) {
    return (
      <main className="container">
        <div className="card">
          <h1>Carregando sua conta…</h1>
          <p>Um instante…</p>
        </div>
      </main>
    );
  }

  // interface
  return (
    <main className="container">
      <div className="card">
        <h1>Minha conta</h1>

        <div className="grid">
          <div>
            <p><strong>Email:</strong> {user?.email}</p>
            {user?.user_metadata?.full_name && (
              <p><strong>Nome:</strong> {user.user_metadata.full_name}</p>
            )}
            <p>
              <strong>Usuário desde:</strong>{" "}
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
            </p>
          </div>

          <div>
            <h3>Status da assinatura</h3>
            <p>
              Esta área exibirá o status do seu plano após conectarmos o webhook do
              Stripe (ativo, cancelado, período de teste, etc.).
            </p>

            {/* Enquanto o Portal do Cliente do Stripe não estiver ativado,
               deixamos o botão apontando para /subscribe */}
            <div style={{ marginTop: 12 }}>
              <Link className="btn" to="/subscribe">Gerenciar assinatura</Link>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 24, display: "flex", gap: 12 }}>
          <Link className="btn" to="/">Voltar para a Home</Link>
          <button className="btn" onClick={handleLogout}>Sair</button>
        </div>
      </div>
    </main>
  );
}
