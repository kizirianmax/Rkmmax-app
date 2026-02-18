import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider.jsx";
import { isOwnerEmail, OWNER_CREDENTIALS } from "../config/adminCredentials.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data, error: signInError } = await signIn(email, password);

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      // Se é o owner fazendo login
      if (isOwnerEmail(email)) {
        // Se está usando senha temporária, força troca de senha
        if (password === OWNER_CREDENTIALS.tempPassword) {
          navigate("/change-password");
        } else {
          // Redireciona para o dashboard do owner
          navigate("/owner-dashboard");
        }
      } else {
        // Redireciona para home
        navigate("/");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="title-hero">Entrar</h1>
      <form className="agent-card" onSubmit={handleSubmit}>
        {error && (
          <div
            style={{
              padding: 12,
              marginBottom: 12,
              borderRadius: 8,
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
            }}
          >
            {error}
          </div>
        )}

        <label style={{ display: "block", marginBottom: 8 }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 14 }}>
          Senha
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
        </label>

        <button 
          className="btn-chat" 
          type="submit"
          disabled={loading}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </>
  );
}
