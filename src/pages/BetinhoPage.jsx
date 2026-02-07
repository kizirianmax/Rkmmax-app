// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import '../components/betinho/BetinhoUI.css';
import { Loader, AlertCircle } from 'lucide-react';

export default function BetinhoPage() {
  const userId = 'user-123'; // Pegar do contexto de autenticação
  const { betinho, isReady, error } = useBetinho(userId);

  if (error) {
    return (
      <div className="betinho-error-container">
        <AlertCircle size={48} color="#dc3545" />
        <h2>Erro ao Inicializar Betinho</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  if (!isReady || !betinho) {
    return (
      <div className="betinho-loading-container">
        <Loader size={48} className="spinning" />
        <h2>Inicializando Betinho...</h2>
        <p>Carregando sistema de automação 🤖</p>
      </div>
    );
  }

  return (
    <div className="betinho-page">
      <BetinhoChat betinhoInstance={betinho} userId={userId} />
    </div>
  );
}