// src/components/betinho/BetinhoChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader, CheckCircle, AlertCircle } from 'lucide-react';
import AuthorizationDialog from './AuthorizationDialog';
import BetinhoProgress from './BetinhoProgress';
import './BetinhoUI.css';

export default function BetinhoChat({ betinhoInstance, userId }) {
  const [mensagens, setMensagens] = useState([]);
  const [inputText, setInputText] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authData, setAuthData] = useState(null);
  const [progresso, setProgresso] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Mensagem de boas-vindas
    const boasVindas = {
      id: Date.now(),
      tipo: 'betinho',
      conteudo: betinhoInstance.saudacao(),
      timestamp: new Date()
    };
    setMensagens([boasVindas]);

    // Conecta UI ao Betinho
    if (typeof window !== 'undefined') {
      window.betinhoUI = {
        addMessage: (msg) => addMensagem('betinho', msg),
        updateProgress: (prog) => setProgresso(prog),
        showConfirmation: (resumo, callback) => {
          setAuthData({ resumo, callback });
          setShowAuthDialog(true);
        }
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.betinhoUI = null;
      }
    };
  }, [betinhoInstance]);

  useEffect(() => {
    scrollToBottom();
  }, [mensagens]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMensagem = (tipo, conteudo) => {
    const novaMensagem = {
      id: Date.now(),
      tipo,
      conteudo,
      timestamp: new Date()
    };
    setMensagens(prev => [...prev, novaMensagem]);
  };

  const handleEnviar = async () => {
    if (!inputText.trim() || enviando) return;

    const textoEnviado = inputText.trim();
    setInputText('');
    
    // Adiciona mensagem do usuário
    addMensagem('user', textoEnviado);
    
    setEnviando(true);

    try {
      // Envia para o Betinho processar
      const resultado = await betinhoInstance.executarTarefaCompleta({
        descricao: textoEnviado,
        usuarioId: userId,
        context: {}
      });

      // Adiciona resposta do Betinho
      if (resultado.mensagem) {
        addMensagem('betinho', resultado.mensagem);
      }

      // Se houve erro, mostra
      if (resultado.status === 'ERROR') {
        addMensagem('betinho', '❌ ' + resultado.mensagem);
      }

    } catch (error) {
      console.error('Erro ao processar:', error);
      addMensagem('betinho', '❌ Ops! Algo deu errado. Por favor, tente novamente.');
    } finally {
      setEnviando(false);
      setProgresso(null);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleEnviar();
    }
  };

  const handleAuthResponse = (resposta) => {
    setShowAuthDialog(false);
    if (authData?.callback) {
      authData.callback(resposta);
    }
    setAuthData(null);
  };

  return (
    <div className="betinho-chat-container">
      {/* Header */}
      <div className="betinho-header">
        <div className="betinho-avatar">
          🤖
        </div>
        <div className="betinho-info">
          <h2>Betinho</h2>
          <p>Sistema de Automação Hiper Inteligente</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="betinho-messages">
        {mensagens.map((msg) => (
          <div 
            key={msg.id} 
            className={`message message-${msg.tipo}`}
          >
            <div className="message-avatar">
              {msg.tipo === 'betinho' ? '🤖' : '👤'}
            </div>
            <div className="message-content">
              {msg.conteudo}
            </div>
          </div>
        ))}
        
        {enviando && (
          <div className="message message-betinho">
            <div className="message-avatar">
              <Loader size={20} className="spinning" />
            </div>
            <div className="message-content">
              Processando sua solicitação...
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Progresso */}
      {progresso && <BetinhoProgress progresso={progresso} />}

      {/* Input */}
      <div className="betinho-input-container">
        <input
          type="text"
          className="betinho-input"
          placeholder="Descreva o que você quer automatizar..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={enviando}
        />
        <button
          className="betinho-send-button"
          onClick={handleEnviar}
          disabled={enviando || !inputText.trim()}
        >
          {enviando ? <Loader size={20} className="spinning" /> : <Send size={20} />}
        </button>
      </div>

      {/* Dialog de autorização */}
      {showAuthDialog && authData && (
        <AuthorizationDialog
          resumo={authData.resumo}
          onResponse={handleAuthResponse}
        />
      )}
    </div>
  );
}