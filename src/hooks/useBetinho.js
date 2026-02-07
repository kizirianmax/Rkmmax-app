// src/hooks/useBetinho.js
import { useState, useEffect } from 'react';
import BetinhoHyperIntelligent from '../backend/BetinhoHyperIntelligent';

export function useBetinho(userId) {
  const [betinho, setBetinho] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function initBetinho() {
      try {
        setIsReady(false);
        setError(null);

        // Inicializar Betinho
        const instance = new BetinhoHyperIntelligent({
          userId,
          enableAudit: true,
          autoIntegrate: true
        });

        await instance.initialize();
        
        setBetinho(instance);
        setIsReady(true);
      } catch (err) {
        console.error('Erro ao inicializar Betinho:', err);
        setError(err.message || 'Erro desconhecido ao inicializar Betinho');
        setIsReady(false);
      }
    }

    if (userId) {
      initBetinho();
    }

    // Cleanup
    return () => {
      if (betinho) {
        betinho.shutdown?.();
      }
    };
  }, [userId]);

  return { betinho, isReady, error };
}