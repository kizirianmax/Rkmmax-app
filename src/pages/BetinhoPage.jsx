// src/pages/BetinhoPage.jsx
import React from 'react';
import BetinhoChat from '../components/betinho/BetinhoChat';
import { useBetinho } from '../hooks/useBetinho';
import { Loader } from 'lucide-react';
import '../components/betinho/BetinhoUI.css';

export default function BetinhoPage() {
  const { betinho, isReady, userId } = useBetinho();

  if (!isReady) {
    return (
      <div className="loading-container">
        <Loader className="spinning" size={48} />
        <p>Inicializando Betinho...</p>
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