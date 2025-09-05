import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Account() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState({ email: "", username: "" });

  useEffect(() => {
    // Pega sessão atual
    const currentSession = supabase.auth.session
      ? supabase.auth.session()
      : null;
    setSession(currentSession);

    // Listener de mudanças na sessão
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    setLoading(false);

    return () => {
      authListener?.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (session?.user) {
      getProfile();
    }
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      let { data, error } = await supabase
        .from("profiles")
        .select(`email, username`)
        .eq("id", session.user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfile({
          email: data.email,
          username: data.username,
        });
      }
    } catch (error) {
      console.error("Erro ao carregar perfil:", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  if (!session) {
    return (
      <div className="container">
        <h2>Você não está logado</h2>
        <Link to="/login">Ir para Login</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Minha Conta</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Usuário:</strong> {profile.username}</p>
        </>
      )}

      <button onClick={handleLogout} className="btn">
        Sair
      </button>
    </div>
  );
}
