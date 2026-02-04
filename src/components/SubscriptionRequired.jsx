// src/components/SubscriptionRequired.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useSubscription } from "../hooks/useSubscription.js";
import { useAuth } from "../auth/AuthProvider.jsx";

/**
 * Componente que bloqueia conteúdo para usuários sem assinatura
 * Mostra loader enquanto verifica, depois bloqueia ou libera
 */
export default function SubscriptionRequired({ children }) {
  const { user, loading: authLoading } = useAuth();
  const { hasSubscription, loading: subLoading } = useSubscription();
  const navigate = useNavigate();

  // Aguardar carregamento
  if (authLoading || subLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loader}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Usuário não logado
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <span style={styles.icon}>🔒</span>
          </div>
          <h1 style={styles.title}>Acesso Restrito</h1>
          <p style={styles.description}>
            Você precisa estar logado para acessar este conteúdo.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={styles.button}
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  // Usuário logado mas sem assinatura
  if (!hasSubscription) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.iconWrapper}>
            <span style={styles.icon}>💎</span>
          </div>
          <h1 style={styles.title}>Assinatura Necessária</h1>
          <p style={styles.description}>
            Para acessar os <strong>54 especialistas em IA</strong> e o <strong>KIZI</strong>, 
            você precisa de uma assinatura ativa.
          </p>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.checkIcon}>✓</span>
              <span>Acesso ilimitado aos especialistas</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkIcon}>✓</span>
              <span>KIZI - Assistente pessoal 24/7</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkIcon}>✓</span>
              <span>Processamento prioritário</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkIcon}>✓</span>
              <span>Suporte premium</span>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button
              onClick={() => navigate("/pricing")}
              style={styles.primaryButton}
            >
              Ver Planos e Assinar
            </button>
            <button
              onClick={() => navigate("/home")}
              style={styles.secondaryButton}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Usuário tem assinatura ativa - libera acesso
  return <>{children}</>;
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "24px",
    padding: "48px",
    maxWidth: "500px",
    width: "100%",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
    textAlign: "center",
  },
  loader: {
    textAlign: "center",
  },
  spinner: {
    width: "48px",
    height: "48px",
    border: "4px solid rgba(255, 255, 255, 0.3)",
    borderTop: "4px solid #ffffff",
    borderRadius: "50%",
    margin: "0 auto 16px",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    color: "#ffffff",
    fontSize: "18px",
    fontWeight: "600",
  },
  iconWrapper: {
    marginBottom: "24px",
  },
  icon: {
    fontSize: "64px",
  },
  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1e293b",
    marginBottom: "16px",
  },
  description: {
    fontSize: "16px",
    color: "#64748b",
    lineHeight: "1.6",
    marginBottom: "32px",
  },
  features: {
    textAlign: "left",
    marginBottom: "32px",
    padding: "24px",
    background: "#f8fafc",
    borderRadius: "12px",
  },
  feature: {
    display: "flex",
    alignItems: "center",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#334155",
  },
  checkIcon: {
    width: "24px",
    height: "24px",
    background: "#22c55e",
    color: "#ffffff",
    borderRadius: "50%",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    marginRight: "12px",
    fontWeight: "bold",
    fontSize: "12px",
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
    flexDirection: "column",
  },
  primaryButton: {
    width: "100%",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)",
    color: "#000000",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  secondaryButton: {
    width: "100%",
    padding: "16px 32px",
    background: "#e2e8f0",
    color: "#334155",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  button: {
    width: "100%",
    padding: "16px 32px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
};
