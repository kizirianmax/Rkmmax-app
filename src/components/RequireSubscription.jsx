// src/components/RequireSubscription.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';
import { useSubscription } from '../hooks/useSubscription.js';

export default function RequireSubscription({ children }) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();

  // Aguardar verificações
  if (authLoading || subLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>
          <div style={styles.spinner}></div>
          <p>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Usuário não logado
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>🔒</div>
          <h2 style={styles.title}>Acesso Restrito</h2>
          <p style={styles.description}>
            Você precisa estar logado para acessar este recurso.
          </p>
          <button
            onClick={() => navigate('/login')}
            style={styles.button}
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

  // Usuário logado mas sem assinatura ativa
  if (!hasActiveSubscription) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.icon}>💳</div>
          <h2 style={styles.title}>Assinatura Necessária</h2>
          <p style={styles.description}>
            Para acessar os <strong>54 especialistas de IA</strong> e todos os recursos premium,
            você precisa de uma assinatura ativa.
          </p>
          
          <div style={styles.features}>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>54 Especialistas em IA</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>KIZI - Assistente 24/7</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>Study Lab Premium</span>
            </div>
            <div style={styles.feature}>
              <span style={styles.checkmark}>✓</span>
              <span>Processamento Prioritário</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/pricing')}
            style={styles.button}
          >
            Ver Planos e Assinar
          </button>

          <p style={styles.footer}>
            Já é assinante? Verifique seu email ou{' '}
            <a href="mailto:suporte@kizirianmax.site" style={styles.link}>
              entre em contato
            </a>
          </p>
        </div>
      </div>
    );
  }

  // Usuário tem assinatura ativa - libera acesso
  return <>{children}</>;
}

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  icon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: '16px',
  },
  description: {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  features: {
    background: '#f8fafc',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'left',
  },
  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '15px',
    color: '#1e293b',
  },
  checkmark: {
    color: '#22c55e',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  button: {
    width: '100%',
    padding: '16px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s',
  },
  footer: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#64748b',
  },
  link: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    color: 'white',
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid rgba(255,255,255,0.3)',
    borderTop: '4px solid white',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
};