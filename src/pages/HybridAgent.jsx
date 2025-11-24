import React, { useState, useEffect, useRef } from 'react';
import '../styles/HybridAgent.css';

/**
 * HybridAgent - Sistema Híbrido Inteligente RKMMAX v2.0.0
 * Modo Manual: Usuário controla tudo
 * Modo Autônomo: Sistema executa tarefas automaticamente
 */
export default function HybridAgent() {
  const [mode, setMode] = useState('manual'); // 'manual' ou 'autonomous'
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Bem-vindo ao RKMMAX Híbrido v2.0.0 - Sistema Inteligente de Agentes',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'agent',
      agent: 'Serginho',
      content: 'Olá! Sou Serginho, seu orquestrador de IA. Posso trabalhar em modo manual (você controla) ou autônomo (eu executo). Como posso ajudar?',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Serginho');
  const messagesEndRef = useRef(null);

  const agents = [
    { id: 'serginho', name: 'Serginho', role: 'Orquestrador', icon: '🤖' },
    { id: 'researcher', name: 'Pesquisador', role: 'Análise', icon: '🔍' },
    { id: 'writer', name: 'Escritor', role: 'Conteúdo', icon: '✍️' },
    { id: 'developer', name: 'Dev', role: 'Código', icon: '💻' },
    { id: 'designer', name: 'Designer', role: 'Visual', icon: '🎨' },
  ];

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
    setInput('');
    setLoading(true);

    try {
      // Simular resposta do agente
      setTimeout(() => {
        const agentResponse = {
          id: messages.length + 2,
          type: 'agent',
          agent: selectedAgent,
          content: `[${mode.toUpperCase()}] Processando: "${input}"...`,
          timestamp: new Date(),
          metadata: {
            mode,
            agent: selectedAgent,
            timestamp: new Date().toISOString(),
          },
        };

        setMessages((prev) => [...prev, agentResponse]);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      setLoading(false);
    }
  };

  return (
    <div className="hybrid-agent-container">
      {/* Header */}
      <div className="hybrid-header">
        <div className="header-content">
          <h1>🤖 RKMMAX Híbrido</h1>
          <p>v2.0.0 - Sistema Inteligente de Agentes</p>
        </div>
        <div className="mode-badge">
          {mode === 'manual' ? '🎮 Manual' : '⚡ Autônomo'}
        </div>
      </div>

      <div className="hybrid-main">
        {/* Sidebar - Agentes */}
        <aside className="hybrid-sidebar">
          <div className="sidebar-section">
            <h3>Agentes Disponíveis</h3>
            <div className="agents-list">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent.name)}
                  className={`agent-btn ${selectedAgent === agent.name ? 'active' : ''}`}
                >
                  <span className="agent-icon">{agent.icon}</span>
                  <div className="agent-info">
                    <p className="agent-name">{agent.name}</p>
                    <p className="agent-role">{agent.role}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="sidebar-section">
            <h3>Modo</h3>
            <div className="mode-buttons">
              <button
                onClick={() => setMode('manual')}
                className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
              >
                🎮 Manual
              </button>
              <button
                onClick={() => setMode('autonomous')}
                className={`mode-btn ${mode === 'autonomous' ? 'active' : ''}`}
              >
                ⚡ Autônomo
              </button>
            </div>
          </div>

          {/* Info */}
          <div className="sidebar-section info-box">
            <p>
              <strong>Manual:</strong> Você controla cada ação.
            </p>
            <p>
              <strong>Autônomo:</strong> Sistema executa automaticamente.
            </p>
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="hybrid-chat">
          {/* Messages */}
          <div className="messages-container">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message message-${message.type}`}
              >
                {message.agent && (
                  <p className="message-agent">{message.agent}</p>
                )}
                <p className="message-content">{message.content}</p>
                {message.metadata?.mode && (
                  <p className="message-meta">
                    {message.metadata.mode.toUpperCase()}
                  </p>
                )}
              </div>
            ))}
            {loading && (
              <div className="message message-system">
                <p className="message-content">
                  <span className="typing-indicator">
                    <span></span><span></span><span></span>
                  </span>
                </p>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="input-area">
            <div className="input-wrapper">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Descreva a tarefa que deseja executar... (Shift+Enter para nova linha)"
                disabled={loading}
                className="message-input"
                rows="2"
              />
              <button
                onClick={handleSendMessage}
                disabled={loading || !input.trim()}
                className="send-btn"
              >
                {loading ? '⏳' : '➤'}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

