import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function Login() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("login"); // "login" ou "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (mode === "login") {
        result = await supabase.auth.signInWithPassword({ email, password });
      } else {
        result = await supabase.auth.signUp({ email, password });
      }

      if (result.error) {
        setError(result.error.message);
      } else {
        navigate("/"); // redireciona para home após login/cadastro
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
    }

    setLoading(false);
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        {mode === "login" ? "Entrar" : "Criar Conta"}
      </h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
        </button>
      </form>
      <div style={styles.switchRow}>
        <button
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          style={styles.linkBtn}
        >
          {mode === "login"
            ? "Não tem conta? Cadastre-se"
            : "Já tem conta? Entrar"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "60px auto",
    padding: 20,
    border: "1px solid #ddd",
    borderRadius: 10,
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    marginBottom: 20,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  button: {
    height: 44,
    borderRadius: 10,
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontWeight: 700,
    fontSize: 16,
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  linkBtn: {
    marginTop: 10,
    background: "transparent",
    border: "none",
    color: "#0ea5e9",
    cursor: "pointer",
    fontWeight: 600,
  },
  switchRow: {
    marginTop: 10,
  },
};
