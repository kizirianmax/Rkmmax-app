// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import '../components/betinho/BetinhoUI.css';

export default function BetinhoPage() {
  const { betinho, isReady } = useBetinho();

  if (!isReady) {
    return (
      <div className="betinho-loading">
        <div className="loading-spinner"></div>
        <h2>🤖 Inicializando Betinho...</h2>
        <p>Carregando sistema de automação hiper inteligente</p>
      </div>
    );
  }

  return (
    <div className="betinho-page">
      <BetinhoChat 
        betinhoInstance={betinho} 
        userId="user_123" 
      />
    </div>
  );
}