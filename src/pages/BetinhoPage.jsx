// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import '../components/betinho/BetinhoUI.css';

export default function BetinhoPage() {
  const { betinho, isReady } = useBetinho({
    // Configurações opcionais
    serginho: null, // Será conectado depois
    especialistas: null, // Será conectado depois
    github: null // Token do GitHub
  });

  if (!isReady) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">🤖</div>
        <p>Iniciando Betinho...</p>
      </div>
    );
  }

  return (
    <div className="betinho-page">
      <BetinhoChat 
        betinhoInstance={betinho}
        userId="user-123" // Substituir pelo ID real do usuário
      />
    </div>
  );
}