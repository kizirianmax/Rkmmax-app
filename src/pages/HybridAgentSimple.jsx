import { useState, useRef, useEffect } from 'react';
import '../styles/HybridAgent.css';

/**
 * RKMMAX HYBRID - VERSÃO MANUS SIMPLIFICADA
 * Um único agente (Serginho) que faz TUDO
 * Metodologia: Execução real com fallback automático
 * Gemini 2.0 Flash → GROQ → Gemini Pro
 * Modos: Manual (1 crédito) | Otimizado (0.5 crédito)
 * 
 * Microfone: Press & Hold com envio automático
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
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [userPlan, setUserPlan] = useState('basic');
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordingIntervalRef = useRef(null);
  const mouseDownRef = useRef(false);

  // Limites por plano
  const RECORDING_LIMITS = {
    basic: { maxSeconds: 30, maxPerDay: 5 },
    intermediate: { maxSeconds: 60, maxPerDay: 20 },
    premium: { maxSeconds: 120, maxPerDay: 100 }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, []);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    await sendMessageWithText(input);
  };

  const sendMessageWithText = async (messageText) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: messageText,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
      console.log(`📤 Enviando para /api/chat (Serginho) - Modo: ${mode}`);

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
              content: messageText,
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

  const startRecording = async () => {
    try {
      const limits = RECORDING_LIMITS[userPlan];
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        await handleAudioUpload(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= limits.maxSeconds) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (error) {
      console.error('Erro ao acessar microfone:', error);
      alert('Permissão de microfone negada');
    }
  };

  const stopRecording = () => {
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
    setRecordingTime(0);
  };

  const handleMicrophoneMouseDown = () => {
    mouseDownRef.current = true;
    startRecording();
  };

  const handleMicrophoneMouseUp = () => {
    if (mouseDownRef.current) {
      mouseDownRef.current = false;
      stopRecording();
    }
  };

  const handleMicrophoneTouchStart = (e) => {
    e.preventDefault();
    mouseDownRef.current = true;
    startRecording();
  };

  const handleMicrophoneTouchEnd = (e) => {
    e.preventDefault();
    if (mouseDownRef.current) {
      mouseDownRef.current = false;
      stopRecording();
    }
  };

  const handleAudioUpload = async (audioBlob) => {
    try {
      console.log('🎤 Enviando áudio para transcrição...', audioBlob);
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.mp3');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      console.log('📥 Resposta recebida:', response.status);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na transcrição');
      }

      const data = await response.json();
      console.log('✅ Transcrição concluída:', data);
      
      const transcript = data.transcript || data.text || '';
      if (transcript) {
        console.log('📝 Texto transcrito:', transcript);
        
        // Enviar automaticamente após transcrição
        setTimeout(() => {
          console.log('🚀 Enviando automaticamente...');
          sendMessageWithText(transcript);
        }, 300);
      } else {
        console.warn('⚠️ Nenhum texto foi transcrito');
      }
    } catch (error) {
      console.error('❌ Erro ao transcrever áudio:', error);
      alert(`Erro ao transcrever: ${error.message}`);
    }
  };

  const handleImageClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => handleImageUpload(e.target.files[0]);
    input.click();
  };

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) return;

    try {
      console.log('📸 Enviando imagem para análise...', imageFile);
      
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/vision', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erro na análise de imagem');
      }

      const data = await response.json();
      console.log('✅ Análise concluída:', data);
      
      const description = data.description || data.text || 'Imagem processada';
      setInput(`[Imagem analisada] ${description}`);
    } catch (error) {
      console.error('❌ Erro ao processar imagem:', error);
      alert(`Erro ao processar imagem: ${error.message}`);
    }
  };

  const handleGitHubClick = () => {
    window.open('https://github.com/kizirianmax/Rkmmax-app', '_blank');
  };

  useEffect(() => {
    setUserPlan('basic');
  }, []);

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
              <p className="plan-info">📱 Plano: <strong>{userPlan.toUpperCase()}</strong></p>
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
        <div className="input-toolbar">
          <button
            onMouseDown={handleMicrophoneMouseDown}
            onMouseUp={handleMicrophoneMouseUp}
            onMouseLeave={handleMicrophoneMouseUp}
            onTouchStart={handleMicrophoneTouchStart}
            onTouchEnd={handleMicrophoneTouchEnd}
            className={`toolbar-btn mic-btn ${isRecording ? 'recording' : ''}`}
            title="Segure para gravação de voz"
          >
            {isRecording ? `🔴 ${recordingTime}s` : '🎤'}
          </button>
          <button
            onClick={handleImageClick}
            className="toolbar-btn image-btn"
            title="Enviar imagem"
          >
            📸
          </button>
          <button
            onClick={handleGitHubClick}
            className="toolbar-btn github-btn"
            title="Abrir repositório GitHub"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </button>
          {isRecording && (
            <div className="recording-info">
              <span className="recording-timer">
                {recordingTime}s / {RECORDING_LIMITS[userPlan].maxSeconds}s
              </span>
            </div>
          )}
        </div>
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
