// src/hooks/useBetinho.js
import { useState, useEffect, useRef } from 'react';
import BetinhoHyperIntelligent from '../agents/betinho/BetinhoHyperIntelligent.js';
import { betinhoIntegration } from '../integration/BetinhoIntegration.js';

export function useBetinho(userId) {
  const [betinho, setBetinho] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const betinhoRef = useRef(null);

  useEffect(() => {
    try {
      const betinhoInstance = new BetinhoHyperIntelligent({
        serginho: betinhoIntegration.getSerginho(),
        especialistas: betinhoIntegration.getEspecialistas(),
        github: betinhoIntegration.getGitHub()
      });

      betinhoRef.current = betinhoInstance;
      setBetinho(betinhoInstance);
      setIsReady(true);

      console.warn('🤖 Betinho inicializado com sucesso!');
    } catch (err) {
      console.error('Erro ao inicializar Betinho:', err);
      setError(err.message);
    }
  }, []);

  const executarTarefa = async (descricao, context = {}) => {
    if (!betinho) throw new Error('Betinho ainda não está pronto');
    return await betinho.executarTarefaCompleta({ descricao, context, usuarioId: userId });
  };

  return { betinho, isReady, error, executarTarefa };
}