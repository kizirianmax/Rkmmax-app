// src/hooks/useBetinho.js
import { useState, useEffect } from 'react';
import BetinhoHyperIntelligent from '../agents/betinho/BetinhoHyperIntelligent';
import { useAuth } from './useAuth';

export function useBetinho() {
  const [betinho, setBetinho] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Inicializa Betinho com configurações
    const instance = new BetinhoHyperIntelligent({
      serginho: null, // Será conectado depois
      especialistas: null, // Será conectado depois
      github: {
        token: user?.githubToken || null
      }
    });

    setBetinho(instance);
    setIsReady(true);
  }, [user]);

  return {
    betinho,
    isReady,
    userId: user?.id || 'guest'
  };
}