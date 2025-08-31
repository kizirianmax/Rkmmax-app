// src/pages/Login.jsx
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
        // sucesso -> redireciona para a Home
        navigate("/");
      }
    } catch (err) {
      setError("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {mode === "login" ? "Entrar" : "Criar Conta"}
        </h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p style={styles.error}>{error}</p>}
          <button style={styles.button} type="submit" disabled={loading}>
            {loading
              ? "Carregando..."
              : mode === "login"
              ? "Entrar"
              : "Cadastrar"}
          </button>
        </form>
        <div style={styles.switchRow}>
          {mode === "login" ? (
            <p>
              Não tem conta?{" "}
              <button
                style={styles.linkBtn}
                onClick={() => setMode("signup")}
              >
                Cadastre-se
              </button>
            </p>
          ) : (
            <p>
              Já tem conta?{" "}
              <button
                style={styles.linkBtn}
                onClick={() => setMode("login")}
              >
                Entrar
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "#f5f5f5",
  },
  card: {
    width: "100%",
    maxWidth: 400,
    padding: 24,
    borderRadius: 12,
    background: "white",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: 16,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc",
    fontSize: 14,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    border: "none",
    background: "#0ea5e9",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  linkBtn: {
    background: "transparent",
    border: "none",
    color: "#0ea5e9",
    cursor: "pointer",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: 14,
  },
  switchRow: {
    marginTop: 12,
    fontSize: 14,
  },
};
