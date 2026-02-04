// src/components/betinho/BetinhoChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader } from 'lucide-react';
import BetinhoProgress from './BetinhoProgress';
import AuthorizationDialog from './AuthorizationDialog';

export default function BetinhoChat({ betinhoInstance, userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(null);
  const [authRequest, setAuthRequest] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    addMessage({
      type: 'betinho',
      content: '🤖 **Oi! Sou o Betinho!**\n\nSou o sistema de automação hiper inteligente da RKMMAX.\nPosso automatizar praticamente qualquer coisa!\n\nO que você precisa automatizar? 💪'
    });

    if (typeof window !== 'undefined') {
      window.betinhoUI = {
        addMessage: (content) => addMessage({ type: 'betinho', content }),
        updateProgress: (prog) => setProgress(prog),
        showConfirmation: (resumo, callback) => setAuthRequest({ resumo, callback })
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMessage = (message) => {
    setMessages(prev => [...prev, { ...message, timestamp: new Date() }]);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    addMessage({ type: 'user', content: userMessage });
    setIsProcessing(true);

    try {
      const resultado = await betinhoInstance.executarTarefaCompleta({
        descricao: userMessage,
        context: {},
        usuarioId: userId
      });

      addMessage({
        type: 'betinho',
        content: resultado.mensagem,
        status: resultado.status,
        dados: resultado.dados
      });
    } catch (error) {
      addMessage({
        type: 'betinho',
        content: `🤖 Ops! Tive um problema: ${error.message}`
      });
    } finally {
      setIsProcessing(false);
      setProgress(null);
    }
  };

  const handleAuthorization = (response) => {
    if (authRequest?.callback) {
      authRequest.callback(response);
    }
    setAuthRequest(null);
  };

  return (
    <div className="betinho-chat-container">
      <div className="betinho-header">
        <div className="betinho-avatar">
          <Bot size={32} />
        </div>
        <div className="betinho-info">
          <h2>Betinho 🤖</h2>
          <p>{isProcessing ? '⚙️ Trabalhando...' : '✅ Online'}</p>
        </div>
      </div>

      <div className="betinho-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message message-${msg.type}`}> 
            <div className="message-avatar">
              {msg.type === 'betinho' ? <Bot size={20} /> : <User size={20} />}
            </div>
            <div className="message-content">
              <div dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }} />
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="message message-betinho"> 
            <Loader size={20} className="spinning" />
            <span>Pensando...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {progress && <BetinhoProgress progress={progress} />}
      {authRequest && <AuthorizationDialog resumo={authRequest.resumo} onResponse={handleAuthorization} />}

      <div className="betinho-input-container">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="O que você precisa automatizar?"
          disabled={isProcessing}
        />
        <button onClick={handleSend} disabled={isProcessing || !input.trim()}>
          <Send size={20} />
        </button>
      </div>
    </div>
  );
}

function formatMessage(content) {
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
}