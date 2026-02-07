// src/components/betinho/BetinhoChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader } from 'lucide-react';
import AuthorizationDialog from './AuthorizationDialog';
import BetinhoProgress from './BetinhoProgress';
import './BetinhoUI.css';

export default function BetinhoChat({ betinhoInstance, userId }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authorizationData, setAuthorizationData] = useState(null);
  const [currentProgress, setCurrentProgress] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Mensagem de boas-vindas
    setMessages([{
      id: 'welcome',
      tipo: 'betinho',
      texto: betinhoInstance.saudacao(),
      timestamp: new Date()
    });

    // Conectar UI com Betinho
    if (typeof window !== 'undefined') {
      window.betinhoUI = {
        addMessage: (texto) => addMessage('betinho', texto),
        updateProgress: (progresso) => setCurrentProgress(progresso),
        showConfirmation: (resumo, callback) => {
          setAuthorizationData({ resumo, callback });
          setShowAuthDialog(true);
        }
      };
    }

    return () => {
      if (typeof window !== 'undefined') {
        delete window.betinhoUI;
      }
    };
  }, [betinhoInstance]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addMessage = (tipo, texto) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      tipo,
      texto,
      timestamp: new Date()
    }]);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const userMessage = inputText.trim();
    setInputText('');
    
    addMessage('user', userMessage);
    setIsProcessing(true);

    try {
      const resultado = await betinhoInstance.executarTarefaCompleta({
        descricao: userMessage,
        usuarioId: userId,
        context: {}
      });

      addMessage('betinho', resultado.mensagem);
      setCurrentProgress(null);

    } catch (error) {
      console.error('Erro ao processar:', error);
      addMessage('betinho', `❌ Ops! Aconteceu um erro: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAuthorization = (resposta) => {
    if (authorizationData?.callback) {
      authorizationData.callback(resposta);
    }
    setShowAuthDialog(false);
    setAuthorizationData(null);
  };

  return (
    <>
      <div className="betinho-chat-container">
        <div className="betinho-header">
          <div className="betinho-avatar">🤖</div>
          <div className="betinho-info">
            <h2>Betinho</h2>
            <p>Sistema de Automação Hiper Inteligente</p>
          </div>
        </div>

        {currentProgress && <BetinhoProgress progress={currentProgress} />}

        <div className="betinho-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message message-${msg.tipo}`}> 
              <div className="message-avatar">
                {msg.tipo === 'betinho' ? '🤖' : '👤'}
              </div>
              <div className="message-content">
                <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.texto) }} />
                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginTop: '0.5rem' }}>
                  {msg.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="betinho-input-container">
          <input
            type="text"
            className="betinho-input"
            placeholder="Digite o que você quer automatizar..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isProcessing}
          />
          <button
            className="betinho-send-button"
            onClick={handleSendMessage}
            disabled={isProcessing || !inputText.trim()}
          >
            {isProcessing ? <Loader size={20} className="spinning" /> : <Send size={20} />}
          </button>
        </div>
      </div>

      {showAuthDialog && authorizationData && (
        <AuthorizationDialog
          resumo={authorizationData.resumo}
          onConfirm={(resposta) => handleAuthorization(resposta)}
          onCancel={() => handleAuthorization({ acao: 'CANCELAR' })}
        />
      )}
    </>
  );
}

function formatMessage(texto) {
  return texto
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />');
}