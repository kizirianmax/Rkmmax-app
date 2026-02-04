// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import { Loader, AlertCircle } from 'lucide-react';
import '../components/betinho/BetinhoUI.css';

export default function BetinhoPage() {
  const userId = 'user_001'; // TODO: Pegar do contexto de autenticação
  const { betinho, isReady, error } = useBetinho(userId);

  if (error) {
    return (
      <div className="betinho-error-page">
        <AlertCircle size={48} color="#dc3545" />
        <h2>Erro ao inicializar Betinho</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="betinho-loading-page">
        <Loader size={48} className="spinning" />
        <h2>Inicializando Betinho...</h2>
        <p>Carregando sistema de automação hiper inteligente</p>
      </div>
    );
  }

  return (
    <div className="betinho-page">
      <BetinhoChat 
        betinhoInstance={betinho} 
        userId={userId} 
      />
    </div>
  );
}