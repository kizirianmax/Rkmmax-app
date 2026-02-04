// src/components/RequireSubscription.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider.jsx';
import { useSubscription } from '../hooks/useSubscription.js';

export default function RequireSubscription({ children }) {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { hasActiveSubscription, loading: subLoading } = useSubscription();

  // Enquanto carrega, mostra loading
  if (authLoading || subLoading) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
          <p style={{ fontSize: 18 }}>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  // Se não está logado
  if (!user) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 40,
          maxWidth: 500,
          textAlign: 'center',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>🔒</div>
          <h1 style={{ fontSize: 28, marginBottom: 16, color: '#1e293b' }}>Acesso Restrito</h1>
          <p style={{ fontSize: 16, color: '#64748b', marginBottom: 32 }}>
            Você precisa fazer login para acessar esta área.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '14px 28px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Fazer Login
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '14px 28px',
                background: '#f1f5f9',
                color: '#1e293b',
                border: 'none',
                borderRadius: 12,
                fontSize: 16,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se está logado mas não tem assinatura ativa
  if (!hasActiveSubscription) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          borderRadius: 20,
          padding: 40,
          maxWidth: 600,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>💎</div>
            <h1 style={{ fontSize: 32, marginBottom: 16, color: '#1e293b', fontWeight: 'bold' }}>
              Assine para Continuar
            </h1>
            <p style={{ fontSize: 18, color: '#64748b', lineHeight: 1.6 }}>
              Esta funcionalidade está disponível apenas para assinantes.
            </p>
          </div>

          {/* Benefícios */}
          <div style={{
            background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
            borderRadius: 16,
            padding: 24,
            marginBottom: 32
          }}>
            <h3 style={{ fontSize: 18, marginBottom: 16, color: '#1e293b' }}>
              O que você ganha assinando:
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🤖</span>
                <span style={{ color: '#1e293b' }}><strong>54 Especialistas em IA</strong></span>
              </li>
              <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>💬</span>
                <span style={{ color: '#1e293b' }}><strong>Serginho - Assistente Pessoal 24/7</strong></span>
              </li>
              <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>📚</span>
                <span style={{ color: '#1e293b' }}><strong>Study Lab Premium</strong></span>
              </li>
              <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>⚡</span>
                <span style={{ color: '#1e293b' }}><strong>Processamento Prioritário</strong></span>
              </li>
              <li style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>💎</span>
                <span style={{ color: '#1e293b' }}><strong>Suporte Premium</strong></span>
              </li>
            </ul>
          </div>

          {/* Ações */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <button
              onClick={() => navigate('/pricing')}
              style={{
                padding: '16px 32px',
                background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 100%)',
                color: '#000',
                border: 'none',
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(34, 211, 238, 0.3)'
              }}
            >
              🚀 Ver Planos
            </button>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '16px 32px',
                background: '#f1f5f9',
                color: '#1e293b',
                border: 'none',
                borderRadius: 12,
                fontSize: 18,
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Voltar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Se tem assinatura ativa, mostra o conteúdo
  return <>{children}</>;
}