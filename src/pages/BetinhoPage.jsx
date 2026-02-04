// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import '../components/betinho/BetinhoUI.css';

export default function BetinhoPage() {
  const { betinho, isReady, error } = useBetinho('user-123');

  if (error) {
    return (
      <div className="betinho-error-container">
        <h2>❌ Erro ao inicializar Betinho</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="betinho-loading-container">
        <div className="loading-spinner"></div>
        <h2>🤖 Inicializando Betinho...</h2>
        <p>Preparando sistema de automação hiper inteligente...</p>
      </div>
    );
  }

  return (
    <div className="betinho-page">
      <BetinhoChat betinhoInstance={betinho} userId="user-123" />
    </div>
  );
}