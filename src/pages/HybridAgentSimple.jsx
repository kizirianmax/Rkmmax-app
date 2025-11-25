import { useState, useRef, useEffect } from 'react';
import '../styles/HybridAgent.css';

/**
 * HYBRID AGENT - VERSÃO SIMPLES
 * Sem dependências de API, tudo funciona localmente
 */
export default function HybridAgentSimple() {
  const [mode, setMode] = useState('manual');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: '🤖 Bem-vindo ao RKMMAX Híbrido v2.0.0 - Sistema Inteligente de Agentes',
      timestamp: new Date(),
    },
    {
      id: 2,
      type: 'agent',
      agent: 'Serginho',
      content: 'Olá! Sou Serginho, seu orquestrador de IA. Descreva a tarefa que deseja executar e eu faço!',
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

  const callGeminiDirect = async (prompt) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDyWJaABfXHWjKxT0pP0L0F0F0F0F0F0F0`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2000,
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Gemini error: ${response.status}`);
      }

      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sem resposta';
    } catch (error) {
      console.error('Erro ao chamar Gemini:', error);
      throw error;
    }
  };

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
      console.log('📤 Enviando para Gemini:', userInput);
      
      // Chamar Gemini direto
      const aiResponse = await callGeminiDirect(userInput);

      console.log('✅ Resposta recebida:', aiResponse);

      // Adicionar resposta do agente
      const agentMessage = {
        id: messages.length + 2,
        type: 'agent',
        agent: selectedAgent,
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (error) {
      console.error('❌ Erro:', error);
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
    <div className="hybrid-agent-container">
      {/* Sidebar - Agentes */}
      <div className="hybrid-sidebar">
        <div className="sidebar-section">
          <h3>AGENTES DISPONÍVEIS</h3>
          <div className="agents-list">
            {agents.map((agent) => (
              <button
                key={agent.id}
                className={`agent-button ${selectedAgent === agent.name ? 'active' : ''}`}
                onClick={() => setSelectedAgent(agent.name)}
              >
                <span className="agent-icon">{agent.icon}</span>
                <div className="agent-info">
                  <div className="agent-name">{agent.name}</div>
                  <div className="agent-role">{agent.role}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Modo */}
        <div className="sidebar-section">
          <h3>MODO</h3>
          <div className="mode-buttons">
            <button
              className={`mode-btn ${mode === 'manual' ? 'active' : ''}`}
              onClick={() => setMode('manual')}
            >
              🎮 Manual
            </button>
            <button
              className={`mode-btn ${mode === 'optimized' ? 'active' : ''}`}
              onClick={() => setMode('optimized')}
            >
              ⚡ Otimizado
            </button>
          </div>
        </div>
      </div>

      {/* Main - Chat */}
      <div className="hybrid-main">
        {/* Header */}
        <div className="hybrid-header">
          <h1>🤖 RKMMAX Híbrido v2.0.0</h1>
          <p>Sistema Inteligente de Agentes</p>
        </div>

        {/* Messages */}
        <div className="hybrid-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message message-${msg.type}`}>
              {msg.type === 'agent' && (
                <div className="message-agent">
                  <span className="agent-badge">{msg.agent}</span>
                </div>
              )}
              <div className="message-content">{msg.content}</div>
            </div>
          ))}
          {loading && (
            <div className="message message-loading">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="hybrid-input-area">
          <textarea
            className="hybrid-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Descreva a tarefa que deseja executar... (Shift+Enter para nova linha)"
            disabled={loading}
          />
          <button
            className="hybrid-send-btn"
            onClick={handleSendMessage}
            disabled={loading || !input.trim()}
          >
            {loading ? '⏳ Processando...' : '📤 Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}

