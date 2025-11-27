import { useState, useRef, useEffect } from 'react';
import '../styles/HybridAgent.css';

/**
 * RKMMAX HYBRID - VERSÃO MANUS SIMPLIFICADA
 * Um único agente (Serginho) que faz TUDO
 * Metodologia: Execução real com fallback automático
 * Gemini 2.0 Flash → GROQ → Gemini Pro
 * Modos: Manual (1 crédito) | Otimizado (0.5 crédito)
 */
export default function HybridAgentSimple() {
  const [mode, setMode] = useState('manual');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '🤖 Bem-vindo ao RKMMAX Híbrido - Sistema Inteligente',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'agent',
      agent: 'Serginho',
      content: 'Olá! Sou Serginho, seu orquestrador de IA. Descreva a tarefa que deseja executar e eu faço!',
      provider: 'gemini-2.0-flash',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Adicionar mensagem do usuário
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      console.log(`📤 Enviando para /api/chat (Serginho) - Modo: ${mode}`);

      // Chamar /api/chat com Serginho
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter(msg => msg.type !== 'system')
              .map(msg => ({
                role: msg.type === 'user' ? 'user' : 'assistant',
                content: msg.content,
              })),
            {
              role: 'user',
              content: userInput,
            },
          ],
          mode: mode.toUpperCase(),
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response || data.message || 'Sem resposta';
      const provider = data.usedProvider || 'unknown';

      console.log(`✅ Resposta recebida de ${provider}`);

      // Adicionar resposta do agente
      const agentMessage = {
        id: messages.length + 2,
        type: 'agent',
        agent: 'Serginho',
        content: aiResponse,
        provider: provider,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);

      // Adicionar mensagem de erro
      const errorMessage = {
        id: messages.length + 2,
        type: 'error',
        content: `❌ Erro: ${error.message}`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="hybrid-container">
      {/* Header */}
      <div className="hybrid-header">
        <div className="header-left">
          <h1>🤖 RKMMAX Híbrido</h1>
          <p>Sistema Inteligente de Agentes</p>
        </div>

        {/* Controles */}
        <div className="header-controls">
          <div className="mode-selector">
            <label>Modo:</label>
            <div className="mode-buttons">
              <button
                className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
                onClick={() => setMode('manual')}
              >
                📋 Manual (1 crédito)
              </button>
              <button
                className={`mode-btn ${mode === 'optimized' ? 'active' : ''}`}
                onClick={() => setMode('optimized')}
              >
                ⚡ Otimizado (0.5 crédito)
              </button>
            </div>
          </div>

          {/* Info Box */}
          <div className="info-section">
            <div className="info-box">
              <h3>SISTEMA</h3>
              <p>🚀 <strong>Versão 3.0.0</strong></p>
              <p>Serginho - Orquestrador de IA</p>
              <p>✅ Gemini 2.0 Flash + GROQ + Pro</p>
              <p>💰 Fallback Automático</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="chat-container">
        <div className="messages-area">
          {messages.map((msg) => (
            <div key={msg.id} className={`message message-${msg.type}`}>
              {msg.type === 'agent' && (
                <div className="message-header">
                  <span className="agent-name">🤖 {msg.agent}</span>
                  {msg.provider && (
                    <span className="provider-badge">{msg.provider}</span>
                  )}
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
              {msg.type === 'user' && (
                <div className="message-header">
                  <span className="user-name">👤 Você</span>
                  <span className="timestamp">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              )}
              <div className="message-content">{msg.content}</div>
            </div>
          ))}

          {loading && (
            <div className="message message-loading">
              <div className="loading-spinner">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <p>Serginho está pensando...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="input-area">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Descreva a tarefa que deseja executar..."
          disabled={loading}
          rows="3"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !input.trim()}
          className="send-button"
        >
          {loading ? '⏳ Enviando...' : '📤 Enviar'}
        </button>
      </div>
    </div>
  );
}
