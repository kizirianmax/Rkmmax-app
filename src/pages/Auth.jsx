import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import "./../App.css";

export default function Auth() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [canChange, setCanChange] = useState(false);
  const [loading, setLoading] = useState(true);

  // Verifica se chegamos via link de recuperação (tem access_token na URL)
  useEffect(() => {
    async function checkRecovery() {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getSession();
        if (data?.session) {
          // sessão válida -> pode trocar a senha
          setCanChange(true);
        } else {
          setMsg("Link inválido ou expirado. Solicite novamente.");
        }
      } catch (e) {
        setMsg("Não foi possível validar o link.");
      } finally {
        setLoading(false);
      }
    }
    checkRecovery();
  }, []);

  async function handleSetNewPassword(e) {
    e.preventDefault();
    setMsg("");

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMsg("❌ Erro: " + error.message);
    } else {
      setMsg("✅ Senha alterada com sucesso! Faça login novamente.");
      // encerra a sessão atual (por segurança) e manda pro login
      await supabase.auth.signOut();
      navigate("/login");
    }
  }

  if (loading) {
    return (
      <div className="container">
        <h2>Carregando…</h2>
      </div>
    );
  }

  if (!canChange) {
    return (
      <div className="container">
        <h2>⚠️ Não foi possível redefinir</h2>
        {msg && <p className="message">{msg}</p>}
        <p>
          <Link to="/reset" className="link">
            Tentar novamente
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>🔒 Definir nova senha</h2>
      <form onSubmit={handleSetNewPassword} className="form">
        <input
          type="password"
          className="input"
          placeholder="Nova senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
        />
        <button type="submit" className="button">
          Salvar nova senha
        </button>
      </form>
      {msg && <p className="message">{msg}</p>}
      <p>
        <Link to="/login" className="link">
          Voltar ao login
        </Link>
      </p>
    </div>
  );
}
