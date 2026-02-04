// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import '../components/betinho/BetinhoUI.css';

export default function BetinhoPage() {
  const userId = 'user-demo'; // TODO: Pegar do contexto de autenticação
  const { betinho, isReady, error } = useBetinho(userId);

  if (error) {
    return (
      <div className="betinho-error">
        <h2>❌ Erro ao inicializar Betinho</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="betinho-loading">
        <div className="spinner"></div>
        <h2>🤖 Inicializando Betinho...</h2>
      </div>
    );
  }

  return (
    <div className="betinho-page">
      <BetinhoChat betinhoInstance={betinho} userId={userId} />
    </div>
  );
}