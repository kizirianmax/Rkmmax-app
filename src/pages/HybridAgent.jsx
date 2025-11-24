import React, { useState, useEffect, useRef } from 'react';
import '../styles/HybridAgent.css';

/**
 * HYBRID AGENT PAGE
 * Interface tipo Manus para o Sistema Híbrido RKMMAX v2.0.0
 * Com suporte a análise de repositórios GitHub
 */
export default function HybridAgent() {
  const [mode, setMode] = useState('manual');
  const [input, setInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
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
      content: 'Olá! Sou Serginho, seu orquestrador de IA. Posso trabalhar com repositórios GitHub! Cole a URL do seu repo e descreva a tarefa que deseja executar.',
      timestamp: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState('Serginho');
  const [showGithubInput, setShowGithubInput] = useState(false);
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

    // Se há URL do GitHub, processar com análise de repo
    if (githubUrl.trim()) {
      return handleGitHubProcess();
    }

    // Caso contrário, processar normalmente
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
      const response = await fetch('/api/hybrid/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userInput,
          mode: mode.toUpperCase(),
          agent: selectedAgent,
          context: {
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      let responseText = 'Processado com sucesso';
      if (data.response) {
        if (typeof data.response === 'string') {
          responseText = data.response;
        } else if (data.response.response) {
          responseText = data.response.response;
        } else if (data.response.message) {
          responseText = data.response.message;
        }
      }

      const agentResponse = {
        id: messages.length + 2,
        type: 'agent',
        agent: selectedAgent,
        content: responseText,
        timestamp: new Date(),
        metadata: {
          mode,
          agent: selectedAgent,
          timestamp: new Date().toISOString(),
        },
      };

      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
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

  const handleGitHubProcess = async () => {
    if (!githubUrl.trim() || !input.trim()) {
      alert('Por favor, preencha a URL do GitHub e a tarefa');
      return;
    }

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: `📦 GitHub: ${githubUrl}\n📝 Tarefa: ${input}`,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input;
    const userGithubUrl = githubUrl;
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/hybrid-github/process', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubUrl: userGithubUrl,
          task: userInput,
          mode: mode.toUpperCase(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `API error: ${response.status}`);
      }

      const data = await response.json();

      let responseText = 'Processado com sucesso';
      if (data.response) {
        if (typeof data.response === 'string') {
          responseText = data.response;
        } else if (data.response.response) {
          responseText = data.response.response;
        } else if (data.response.message) {
          responseText = data.response.message;
        }
      }

      const agentResponse = {
        id: messages.length + 2,
        type: 'agent',
        agent: selectedAgent,
        content: responseText,
        timestamp: new Date(),
        metadata: {
          mode,
          agent: selectedAgent,
          repository: `${data.repository.owner}/${data.repository.repo}`,
          timestamp: new Date().toISOString(),
        },
      };

      setMessages((prev) => [...prev, agentResponse]);
    } catch (error) {
      console.error('Erro ao processar GitHub:', error);
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

  return (
    <div className="hybrid-agent-container">
      {/* Header */}
      <div className="hybrid-header">
        <div className="header-content">
          <h1>🤖 RKMMAX Híbrido</h1>
          <p>v2.0.0 - Sistema Inteligente de Agentes + GitHub</p>
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

          {/* GitHub Toggle */}
          <div className="sidebar-section">
            <h3>GitHub</h3>
            <button
              onClick={() => setShowGithubInput(!showGithubInput)}
              className="mode-btn"
              style={{ width: '100%' }}
            >
              {showGithubInput ? '✅ Ativo' : '📦 Adicionar Repo'}
            </button>
          </div>

          {/* Info */}
          <div className="sidebar-section info-box">
            <p>
              <strong>Manual:</strong> Você controla.
            </p>
            <p>
              <strong>Autônomo:</strong> Sistema executa.
            </p>
            <p>
              <strong>GitHub:</strong> Lê seu repo.
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
                {message.metadata?.repository && (
                  <p className="message-meta">
                    📦 {message.metadata.repository}
                  </p>
                )}
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

          {/* GitHub Input */}
          {showGithubInput && (
            <div className="github-input-area">
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/usuario/repositorio"
                className="github-input"
              />
            </div>
          )}

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
                placeholder={
                  showGithubInput
                    ? "Descreva a tarefa para o repositório... (Shift+Enter para nova linha)"
                    : "Descreva a tarefa que deseja executar... (Shift+Enter para nova linha)"
                }
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

