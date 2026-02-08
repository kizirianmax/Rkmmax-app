// src/pages/ChangePassword.jsx
import React, { useState } from "react";
import { useAuth } from "../auth/AuthProvider.jsx";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabaseClient.js";

export default function ChangePassword() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const validatePassword = (password) => {
    // Mínimo 8 caracteres, pelo menos 1 maiúscula, 1 minúscula, 1 número
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);

    return minLength && hasUpper && hasLower && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // Validações
    if (!validatePassword(newPassword)) {
      setError(
        "A senha deve ter no mínimo 8 caracteres, incluindo maiúsculas, minúsculas e números."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (newPassword === currentPassword) {
      setError("A nova senha deve ser diferente da senha atual.");
      return;
    }

    setLoading(true);

    try {
      // Atualiza a senha no Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate("/owner-dashboard");
      }, 2000);
    } catch (err) {
      setError(err.message || "Erro ao trocar senha. Tente novamente.");
      console.error("Change password error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ padding: 20 }}>
        <h1>Acesso Negado</h1>
        <p>Você precisa estar logado para trocar a senha.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1 className="title-hero">🔑 Trocar Senha</h1>

      {success && (
        <div
          style={{
            padding: 16,
            marginBottom: 20,
            borderRadius: 8,
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.3)",
            color: "#22c55e",
          }}
        >
          ✅ Senha alterada com sucesso! Redirecionando...
        </div>
      )}

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

        <label style={{ display: "block", marginBottom: 16 }}>
          Senha Atual
          <input
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 16 }}>
          Nova Senha
          <input
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
          <small style={{ opacity: 0.7, fontSize: "0.85rem", display: "block", marginTop: 4 }}>
            Mínimo 8 caracteres, com maiúsculas, minúsculas e números
          </small>
        </label>

        <label style={{ display: "block", marginBottom: 20 }}>
          Confirmar Nova Senha
          <input
            type="password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: "1px solid rgba(118,161,220,.2)",
              background: "#0b1626",
              color: "white",
              marginTop: 6,
            }}
          />
        </label>

        <button className="btn-chat" type="submit" disabled={loading || success}>
          {loading ? "Salvando..." : "Trocar Senha"}
        </button>
      </form>
    </div>
  );
}
