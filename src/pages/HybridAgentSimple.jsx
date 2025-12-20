import { useState, useRef, useEffect } from 'react';
import '../styles/HybridAgent.css';
import MarkdownMessage from '../components/MarkdownMessage';

/**
 * RKMMAX HYBRID - Padrão Serginho
 * Visual limpo, claro e focado no chat
 */
export default function HybridAgentSimple() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o Serginho, seu orquestrador de IA. Posso orquestrar 54 especialistas ou responder diretamente. Como posso ajudar?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const imageInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Função para remover bloco <thinking> das respostas
  const removeThinking = (text) => {
    if (!text) return text;
    return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
  };

  // Scroll para o topo ao carregar a página
  useEffect(() => {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  // Verificar token do GitHub na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('github_token');
    const userName = urlParams.get('user_name');

    if (token) {
      localStorage.setItem('github_token', token);
      window.history.replaceState({}, document.title, window.location.pathname);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `✅ GitHub conectado com sucesso! Olá, ${userName}! Agora posso ajudar com seus repositórios.`
      }]);
    }
  }, []);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'genius',
          messages: newMessages,
          agentType: 'hybrid',
          mode: 'OTIMIZADO'
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;
      
      if (!aiResponse || aiResponse.trim() === "") {
        throw new Error("Resposta vazia da IA");
      }
      
      const cleanResponse = removeThinking(aiResponse);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: cleanResponse
      }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Erro ao processar: ${error?.message || "erro desconhecido"}. Tente novamente.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "❌ Seu navegador não suporta gravação de áudio. Tente usar Chrome ou Safari."
        }]);
        return;
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: "🎤 Solicitando permissão do microfone..."
      }]);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setMessages(prev => prev.slice(0, -1));
      
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
          role: "assistant",
          content: "🔄 Transcrevendo áudio..."
        }]);
        
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          });
          
          setMessages(prev => prev.slice(0, -1));
          
          if (!response.ok) {
            throw new Error('Erro na transcrição');
          }
          
          const data = await response.json();
          const text = data.text || data.transcript || '';
          
          if (text) {
            const userMessage = { role: "user", content: text };
            setMessages(prev => [...prev, userMessage]);
            
            setIsLoading(true);
            try {
              const currentMessages = [...messages, userMessage];
              const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'genius',
                  messages: currentMessages,
                  agentType: 'hybrid',
                  mode: 'OTIMIZADO'
                }),
              });

              if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
              }

              const data = await response.json();
              const aiResponse = data.response;
              
              if (aiResponse && aiResponse.trim() !== "") {
                const cleanResponse = removeThinking(aiResponse);
                setMessages(prev => [...prev, {
                  role: "assistant",
                  content: cleanResponse
                }]);
              }
            } catch (error) {
              console.error("Erro ao enviar mensagem de voz:", error);
              setMessages(prev => [...prev, {
                role: "assistant",
                content: `❌ Erro ao processar: ${error?.message || "erro desconhecido"}. Tente novamente.`
              }]);
            } finally {
              setIsLoading(false);
            }
          } else {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: "⚠️ Não foi possível transcrever o áudio. Tente falar mais alto."
            }]);
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
          setMessages(prev => {
            const lastMsg = prev[prev.length - 1];
            if (lastMsg?.content?.includes('Transcrevendo')) {
              return [...prev.slice(0, -1), {
                role: "assistant",
                content: "❌ Erro ao transcrever. Tente novamente."
              }];
            }
            return [...prev, {
              role: "assistant",
              content: "❌ Erro ao transcrever. Tente novamente."
            }];
          });
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "🔴 Gravando... Clique no microfone novamente para parar."
      }]);
      
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Não foi possível acessar o microfone. ${error.name === 'NotAllowedError' ? 'Permissão negada.' : 'Verifique as permissões.'}`
      }]);
    }
  };

  const handleImageAttach = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target.result;
        
        setMessages(prev => [...prev, {
          role: "user",
          content: `🖼️ Imagem: ${file.name}`,
          image: imageBase64
        }]);
        
        setIsLoading(true);
        try {
          const response = await fetch('/api/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64 })
          });
          
          if (!response.ok) {
            throw new Error('Erro na análise de imagem');
          }
          
          const data = await response.json();
          const description = data.description || data.text || 'Imagem processada';
          
          const cleanDescription = removeThinking(description);
          setMessages(prev => [...prev, {
            role: "assistant",
            content: cleanDescription
          }]);
        } catch (error) {
          console.error('Erro ao analisar imagem:', error);
          setMessages(prev => [...prev, {
            role: "assistant",
            content: `❌ Erro ao analisar imagem: ${error.message}`
          }]);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="hybrid-container">
      {/* Header fixo */}
      <div className="hybrid-header">
        <div className="header-content">
          <img src="/avatars/serginho.png" alt="Serginho" className="avatar-large" />
          <div className="header-info">
            <h1>Serginho Híbrido</h1>
            <p>Orquestrador de IA • Online</p>
            <p className="model-badge">🤖 Gemini 2.5 Pro</p>
          </div>
        </div>
      </div>

      {/* Card de boas-vindas */}
      <div className="welcome-container-compact">
        <div className="welcome-card-compact">
          <img src="/avatars/serginho.png" alt="Serginho" className="avatar-compact" />
          <div className="welcome-info-compact">
            <h3>Serginho — Orquestrador Híbrido</h3>
            <p>Orquestro 54 especialistas para resolver qualquer tarefa 💡</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.role === "user" ? "message-user" : "message-assistant"}`}
          >
            {msg.role === "assistant" && (
              <img src="/avatars/serginho.png" alt="Serginho" className="message-avatar" />
            )}
            <div className="message-bubble">
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="Imagem enviada" 
                  style={{
                    maxWidth: '100%',
                    borderRadius: '12px',
                    marginBottom: msg.content ? '8px' : '0'
                  }}
                />
              )}
              <MarkdownMessage 
                content={msg.content} 
                isUser={msg.role === "user"}
              />
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <img src="/avatars/serginho.png" alt="Serginho" className="message-avatar" />
            <div className="message-bubble message-loading">
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

      {/* Input fixo na parte inferior */}
      <div className="input-container">
        <div className="input-wrapper">
          {/* Botão de imagem */}
          <button
            className="icon-btn"
            onClick={handleImageAttach}
            title="Enviar imagem"
          >
            🖼️
          </button>

          {/* Campo de texto */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="message-input"
          />

          {/* Botão de microfone */}
          <button
            className={`icon-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
            title="Gravar áudio"
          >
            🎙️
          </button>

          {/* Botão de enviar */}
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="send-btn"
          >
            ↑
          </button>
        </div>
      </div>

      {/* Input escondido para upload de imagem */}
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
