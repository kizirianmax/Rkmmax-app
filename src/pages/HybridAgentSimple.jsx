import { useState, useRef, useEffect } from 'react';
import '../styles/HybridAgent.css';

/**
 * HYBRID AGENT - VERSÃO DEMO
 * Simula respostas sem gastar créditos
 * Quando tiver créditos, integra com Gemini real
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

  // Respostas simuladas por agente
  const agentResponses = {
    'Serginho': 'Entendido! Vou orquestrar essa tarefa para você. Deixa comigo! 🚀',
    'Pesquisador': 'Vou analisar profundamente esse tema e trazer insights valiosos. 📊',
    'Escritor': 'Vou criar um conteúdo de qualidade, bem estruturado e envolvente. ✍️',
    'Dev': 'Vou desenvolver uma solução robusta e bem otimizada. 💻',
    'Designer': 'Vou criar algo visualmente impressionante e funcional. 🎨',
  };

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

    // Simular delay de processamento
    setTimeout(() => {
      const response = agentResponses[selectedAgent] || 'Tarefa recebida com sucesso!';
      
      // Adicionar resposta do agente
      const agentMessage = {
        id: messages.length + 2,
        type: 'agent',
        agent: selectedAgent,
        content: `${response}\n\n📝 Sua solicitação: "${userInput}"\n\n⚡ Modo: ${mode === 'manual' ? 'Manual (1 crédito)' : 'Otimizado (0.5 crédito)'}\n💾 Créditos: Sistema pronto para usar quando ativar.`,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, agentMessage]);
      setLoading(false);
    }, 1500);
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

        {/* Info */}
        <div className="sidebar-section">
          <h3>INFO</h3>
          <div className="info-box">
            <p>📊 <strong>Sistema Demo</strong></p>
            <p>Respostas simuladas até ativar créditos.</p>
            <p>🚀 Pronto para integração real!</p>
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

