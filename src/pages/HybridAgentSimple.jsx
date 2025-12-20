import { useState, useRef, useEffect, useCallback } from 'react';
import '../styles/HybridAgent.css';
import MarkdownMessage from '../components/MarkdownMessage';
import { AutonomousAgent, AgentState } from '../lib/autonomousAgent';

/**
 * RKMMAX HYBRID AGENT - Estilo Manus
 * Agente Autônomo com planejamento e execução automática
 */
export default function HybridAgentSimple() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [agentState, setAgentState] = useState(AgentState.IDLE);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [currentAction, setCurrentAction] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const imageInputRef = useRef(null);
  const agentRef = useRef(null);

  // Inicializar agente
  useEffect(() => {
    agentRef.current = new AutonomousAgent({
      onStateChange: (state, data) => {
        setAgentState(state);
        if (data.error) {
          console.error('Agent error:', data.error);
        }
      },
      onProgress: (progress) => {
        if (progress.type === 'plan_created') {
          setCurrentPlan(progress.plan);
          setTotalSteps(progress.totalSteps);
        } else if (progress.type === 'step_start') {
          setCurrentStep(progress.step);
          setCurrentAction(progress.action);
        } else if (progress.type === 'step_complete') {
          // Atualizar UI com resultado da etapa
        }
      },
      onMessage: (message) => {
        setMessages(prev => [...prev, message]);
      },
      onToolUse: (tool) => {
        setCurrentAction(`Usando ferramenta: ${tool.tool}`);
      }
    });

    // Mensagem inicial simples
    setMessages([{
      role: 'assistant',
      content: `Olá! Sou o **RKMMAX Agent**, seu assistente autônomo. 🤖

Me dê uma tarefa e eu vou planejar e executar automaticamente para você.`,
      timestamp: Date.now(),
      type: 'welcome'
    }]);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Função para remover thinking
  const removeThinking = (text) => {
    if (!text) return text;
    return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
  };

  // Enviar mensagem e executar agente
  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage = input.trim();
    setInput('');
    setIsProcessing(true);
    setCurrentPlan(null);
    setCurrentStep(0);
    setTotalSteps(0);

    // Detectar se é uma saudação ou mensagem simples
    const isSimpleMessage = (msg) => {
      const simplePatterns = [
        /^(oi|ol[aá]|hey|hi|hello|e a[ií]|opa|fala|salve|bom dia|boa tarde|boa noite|tudo bem|como vai|blz|beleza)[!?.,]*$/i,
        /^(obrigad[oa]|valeu|vlw|thanks|brigad[oa])[!?.,]*$/i,
        /^(sim|n[aã]o|ok|certo|entendi|beleza)[!?.,]*$/i,
        /^.{1,15}$/  // Mensagens muito curtas (menos de 15 caracteres)
      ];
      return simplePatterns.some(pattern => pattern.test(msg.trim()));
    };

    try {
      // Adicionar mensagem do usuário
      setMessages(prev => [...prev, {
        role: 'user',
        content: userMessage,
        timestamp: Date.now()
      }]);

      // Se for mensagem simples, responder diretamente sem planejamento
      if (isSimpleMessage(userMessage)) {
        await agentRef.current.runSimple(userMessage);
      } else {
        // Executar agente autônomo com planejamento
        await agentRef.current.run(userMessage);
      }
      
    } catch (error) {
      console.error('Erro no agente:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `❌ Erro ao processar: ${error.message}`,
        timestamp: Date.now(),
        type: 'error'
      }]);
    } finally {
      setIsProcessing(false);
      setAgentState(AgentState.IDLE);
    }
  };

  // Gravação de voz
  const handleVoiceInput = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '🔄 Transcrevendo áudio...',
          timestamp: Date.now(),
          type: 'status'
        }]);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          });
          
          // Remover mensagem de status
          setMessages(prev => prev.filter(m => m.content !== '🔄 Transcrevendo áudio...'));
          
          if (response.ok) {
            const data = await response.json();
            const text = data.text || data.transcript || '';
            
            if (text) {
              setInput(text);
              // Auto-enviar após transcrição
              setTimeout(() => {
                document.querySelector('.send-btn')?.click();
              }, 100);
            }
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
    }
  };

  // Upload de imagem
  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const imageBase64 = e.target.result;
      
      setMessages(prev => [...prev, {
        role: 'user',
        content: `🖼️ Imagem enviada: ${file.name}`,
        image: imageBase64,
        timestamp: Date.now()
      }]);
      
      setIsProcessing(true);
      
      try {
        const response = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64 })
        });
        
        if (response.ok) {
          const data = await response.json();
          const description = removeThinking(data.description || data.text || 'Imagem analisada');
          
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `## 👁️ Análise da Imagem\n\n${description}`,
            timestamp: Date.now()
          }]);
        }
      } catch (error) {
        console.error('Erro ao analisar imagem:', error);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Renderizar indicador de estado do agente
  const renderAgentStatus = () => {
    if (!isProcessing) return null;

    const stateLabels = {
      [AgentState.PLANNING]: '🧠 Planejando...',
      [AgentState.EXECUTING]: '⚡ Executando...',
      [AgentState.THINKING]: '💭 Pensando...',
      [AgentState.USING_TOOL]: '🔧 Usando ferramenta...',
    };

    return (
      <div className="agent-status-bar">
        <div className="status-indicator">
          <div className="status-pulse"></div>
          <span className="status-text">{stateLabels[agentState] || '⏳ Processando...'}</span>
        </div>
        
        {totalSteps > 0 && (
          <div className="progress-info">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">Etapa {currentStep} de {totalSteps}</span>
          </div>
        )}
        
        {currentAction && (
          <div className="current-action">
            <span>📍 {currentAction}</span>
          </div>
        )}
      </div>
    );
  };

  // Renderizar plano de execução
  const renderPlan = () => {
    if (!currentPlan || !currentPlan.plan) return null;

    return (
      <div className="execution-plan">
        <div className="plan-header">
          <span className="plan-icon">📋</span>
          <span className="plan-title">Plano de Execução</span>
          <span className="plan-complexity">{currentPlan.complexity}</span>
        </div>
        <div className="plan-steps">
          {currentPlan.plan.map((step, index) => (
            <div 
              key={index} 
              className={`plan-step ${index + 1 < currentStep ? 'completed' : ''} ${index + 1 === currentStep ? 'active' : ''}`}
            >
              <div className="step-number">
                {index + 1 < currentStep ? '✓' : index + 1}
              </div>
              <div className="step-content">
                <span className="step-action">{step.action}</span>
                {step.tool && <span className="step-tool">🔧 {step.tool}</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="hybrid-container manus-style">
      {/* Header */}
      <div className="hybrid-header">
        <div className="header-content">
          <div className="header-logo">
            <div className="logo-icon">🤖</div>
            <div className="header-info">
              <h1>RKMMAX Agent</h1>
              <p className="header-subtitle">Agente Autônomo • Modo Automático</p>
            </div>
          </div>
          <div className="header-badge">
            <span className="badge-dot"></span>
            <span>Gemini 2.5 Pro</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {renderAgentStatus()}

      {/* Plan Display */}
      {isProcessing && renderPlan()}

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === 'user' ? 'message-user' : 'message-assistant'} ${msg.type || ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="message-avatar">
                <span>🤖</span>
              </div>
            )}
            <div className="message-bubble">
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="Imagem" 
                  className="message-image"
                />
              )}
              <MarkdownMessage 
                content={msg.content} 
                isUser={msg.role === 'user'}
              />
            </div>
          </div>
        ))}
        
        {isProcessing && (
          <div className="message message-assistant">
            <div className="message-avatar">
              <span>🤖</span>
            </div>
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-container">
        <div className="input-wrapper">
          <button
            className="icon-btn"
            onClick={() => imageInputRef.current?.click()}
            disabled={isProcessing}
            title="Enviar imagem"
          >
            🖼️
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Descreva a tarefa que deseja executar..."
            disabled={isProcessing}
            className="message-input"
          />

          <button
            className={`icon-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
            disabled={isProcessing}
            title="Gravar áudio"
          >
            🎙️
          </button>

          <button
            onClick={handleSend}
            disabled={!input.trim() || isProcessing}
            className="send-btn"
          >
            {isProcessing ? '⏳' : '▶'}
          </button>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
        accept="image/*"
      />
    </div>
  );
}
