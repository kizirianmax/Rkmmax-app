import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMsg({ type: "ok", text: "Login realizado com sucesso! Redirecionando..." });
        // vá para a home
        setTimeout(() => navigate("/"), 500);
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMsg({
          type: "ok",
          text: "Conta criada! Verifique seu e-mail (se exigido) e faça login.",
        });
        setMode("login");
      }
    } catch (err) {
      setMsg({ type: "err", text: err.message || "Falha ao autenticar." });
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword() {
    if (!email) {
      setMsg({ type: "err", text: "Informe seu e-mail para enviar o link de recuperação." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + "/auth",
      });
      if (error) throw error;
      setMsg({ type: "ok", text: "Enviamos um e-mail com instruções para redefinir a senha." });
    } catch (err) {
      setMsg({ type: "err", text: err.message || "Não foi possível enviar o e-mail." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h1 style={styles.title}>{mode === "login" ? "Entrar" : "Criar conta"}</h1>

        {msg && (
          <div
            style={{
              ...styles.alert,
              background: msg.type === "ok" ? "#e8f5e9" : "#ffebee",
              color: msg.type === "ok" ? "#1b5e20" : "#b71c1c",
              borderColor: msg.type === "ok" ? "#c8e6c9" : "#ffcdd2",
            }}
          >
            {msg.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              style={styles.input}
            />
          </label>

          <label style={styles.label}>
            Senha
            <div style={{ position: "relative" }}>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ ...styles.input, paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                style={styles.eyeBtn}
                aria-label={showPwd ? "Esconder senha" : "Mostrar senha"}
              >
                {showPwd ? "🙈" : "👁️"}
              </button>
            </div>
          </label>

          <button type="submit" disabled={loading} style={styles.primaryBtn}>
            {loading
              ? "Aguarde..."
              : mode === "login"
              ? "Entrar"
              : "Criar conta"}
          </button>
        </form>

        {mode === "login" && (
          <button
            type="button"
            onClick={handleResetPassword}
            disabled={loading}
            style={styles.linkBtn}
          >
            Esqueci minha senha
          </button>
        )}

        <div style={styles.switchRow}>
          {mode === "login" ? (
            <>
              <span>Não tem conta?</span>
              <button
                type="button"
                onClick={() => {
                  setMsg(null);
                  setMode("signup");
                }}
                style={styles.linkBtn}
              >
                Criar agora
              </button>
            </>
          ) : (
            <>
              <span>Já tem conta?</span>
              <button
                type="button"
                onClick={() => {
                  setMsg(null);
                  setMode("login");
                }}
                style={styles.linkBtn}
              >
                Fazer login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* Estilos simples inline para evitar depender de CSS externo */
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    background: "#0f172a", // slate-900
    padding: "24px",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "white",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,.15)",
  },
  title: { margin: 0, marginBottom: 12, fontSize: 24, fontWeight: 700 },
  alert: {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid",
    marginBottom: 12,
    fontSize: 14,
  },
  form: { display: "grid", gap: 12 },
  label: { display: "grid", gap: 6, fontSize: 14, fontWeight: 600 },
  input: {
    width: "100%",
    height: 44,
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    outline: "none",
    fontSize: 16,
  },
  eyeBtn: {
    position: "absolute",
    right: 8,
    top: 6,
    height: 32,
    width: 32,
    borderRadius: 8,
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    cursor: "pointer",
  },
  primaryBtn: {
    height: 44,
    borderRadius: 10,
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#0ea5e9",
    padding: 8,
    cursor: "pointer",
    fontWeight: 600,
  },
  switchRow: {
    marginTop: 4,
    display: "flex",
    gap: 8,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 14,
  },
};
