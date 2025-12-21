// src/hooks/useConversationMemory.js
// Hook para gerenciar memória de conversas no localStorage

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'serginho_conversations';
const MAX_CONVERSATIONS = 10; // Máximo de conversas salvas
const MAX_MESSAGES_PER_CONVERSATION = 50; // Máximo de mensagens por conversa

export function useConversationMemory(agentId = 'serginho') {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  // Carregar conversas do localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${agentId}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setConversations(parsed.conversations || []);
        // Usar a conversa mais recente ou criar nova
        if (parsed.conversations && parsed.conversations.length > 0) {
          setCurrentConversationId(parsed.currentId || parsed.conversations[0].id);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    }
  }, [agentId]);

  // Salvar conversas no localStorage
  const saveToStorage = useCallback((convs, currentId) => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_${agentId}`, JSON.stringify({
        conversations: convs,
        currentId: currentId,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Erro ao salvar conversas:', error);
    }
  }, [agentId]);

  // Criar nova conversa
  const createNewConversation = useCallback(() => {
    const newConv = {
      id: Date.now().toString(),
      title: 'Nova conversa',
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedConvs = [newConv, ...conversations].slice(0, MAX_CONVERSATIONS);
    setConversations(updatedConvs);
    setCurrentConversationId(newConv.id);
    saveToStorage(updatedConvs, newConv.id);
    
    return newConv.id;
  }, [conversations, saveToStorage]);

  // Obter conversa atual
  const getCurrentConversation = useCallback(() => {
    return conversations.find(c => c.id === currentConversationId) || null;
  }, [conversations, currentConversationId]);

  // Adicionar mensagem à conversa atual
  const addMessage = useCallback((message) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === currentConversationId) {
          const newMessages = [...conv.messages, message].slice(-MAX_MESSAGES_PER_CONVERSATION);
          
          // Atualizar título com a primeira mensagem do usuário
          let title = conv.title;
          if (title === 'Nova conversa' && message.role === 'user') {
            title = message.content.substring(0, 50) + (message.content.length > 50 ? '...' : '');
          }
          
          return {
            ...conv,
            messages: newMessages,
            title,
            updatedAt: new Date().toISOString()
          };
        }
        return conv;
      });
      
      saveToStorage(updated, currentConversationId);
      return updated;
    });
  }, [currentConversationId, saveToStorage]);

  // Atualizar mensagens da conversa atual
  const updateMessages = useCallback((messages) => {
    setConversations(prev => {
      const updated = prev.map(conv => {
        if (conv.id === currentConversationId) {
          // Atualizar título com a primeira mensagem do usuário
          let title = conv.title;
          const firstUserMsg = messages.find(m => m.role === 'user');
          if (title === 'Nova conversa' && firstUserMsg) {
            title = firstUserMsg.content.substring(0, 50) + (firstUserMsg.content.length > 50 ? '...' : '');
          }
          
          return {
            ...conv,
            messages: messages.slice(-MAX_MESSAGES_PER_CONVERSATION),
            title,
            updatedAt: new Date().toISOString()
          };
        }
        return conv;
      });
      
      saveToStorage(updated, currentConversationId);
      return updated;
    });
  }, [currentConversationId, saveToStorage]);

  // Trocar para outra conversa
  const switchConversation = useCallback((conversationId) => {
    setCurrentConversationId(conversationId);
    saveToStorage(conversations, conversationId);
  }, [conversations, saveToStorage]);

  // Deletar conversa
  const deleteConversation = useCallback((conversationId) => {
    setConversations(prev => {
      const updated = prev.filter(c => c.id !== conversationId);
      
      // Se deletou a conversa atual, mudar para outra
      let newCurrentId = currentConversationId;
      if (conversationId === currentConversationId) {
        newCurrentId = updated.length > 0 ? updated[0].id : null;
        setCurrentConversationId(newCurrentId);
      }
      
      saveToStorage(updated, newCurrentId);
      return updated;
    });
  }, [currentConversationId, saveToStorage]);

  // Gerar resumo do contexto para enviar à API
  const getContextSummary = useCallback(() => {
    const currentConv = getCurrentConversation();
    if (!currentConv || currentConv.messages.length === 0) {
      return null;
    }

    // Pegar últimas 10 mensagens para contexto
    const recentMessages = currentConv.messages.slice(-10);
    
    // Criar resumo
    const summary = recentMessages.map(m => {
      const role = m.role === 'user' ? 'Usuário' : 'Serginho';
      const content = m.content.substring(0, 200) + (m.content.length > 200 ? '...' : '');
      return `${role}: ${content}`;
    }).join('\n');

    return summary;
  }, [getCurrentConversation]);

  // Limpar todas as conversas
  const clearAllConversations = useCallback(() => {
    setConversations([]);
    setCurrentConversationId(null);
    localStorage.removeItem(`${STORAGE_KEY}_${agentId}`);
  }, [agentId]);

  return {
    conversations,
    currentConversationId,
    getCurrentConversation,
    createNewConversation,
    addMessage,
    updateMessages,
    switchConversation,
    deleteConversation,
    getContextSummary,
    clearAllConversations
  };
}

export default useConversationMemory;
