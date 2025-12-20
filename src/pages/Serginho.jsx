// src/pages/Serginho.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Serginho.css";
import MarkdownMessage from "../components/MarkdownMessage";

export default function Serginho() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o KIZI 2.5 Pro operando como Serginho. Posso ajudar com qualquer tarefa - desde programação até pesquisas complexas. Como posso ajudar?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Função para remover bloco <thinking> das respostas
  const removeThinking = (text) => {
    if (!text) return text;
    // Remove tudo entre <thinking> e </thinking> incluindo as tags
    return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
  };

  // Scroll para o topo ao carregar a página e prevenir scroll do body
  useEffect(() => {
    // Adicionar classe ao HTML para aplicar estilos específicos
    document.documentElement.classList.add('serginho-page');
    
    // Scroll para o topo
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    
    return () => {
      document.documentElement.classList.remove('serginho-page');
    };
  }, []);

  useEffect(() => {
    // Só faz scroll para baixo se tiver mais de 1 mensagem
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Adicionar mensagem do usuário
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Chamar API com Gemini Pro 2.5 (nível ChatGPT-5)
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },        body: JSON.stringify({
          type: 'genius',         // Endpoint unificado
          messages: newMessages,
          agentType: 'serginho',  // Prompts de gênio do Serginho
          mode: 'OTIMIZADO'       // Otimização de custo ativada
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
      
      // Remover bloco thinking e adicionar resposta da IA
      const cleanResponse = removeThinking(aiResponse);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: cleanResponse
      }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMsg = error?.message || "erro desconhecido";
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `❌ Erro ao processar: ${errorMsg}. Tente novamente.`
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Parar gravação
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      // Verificar se o navegador suporta gravação de áudio
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "❌ Seu navegador não suporta gravação de áudio. Tente usar Chrome ou Safari."
        }]);
        return;
      }

      // Mostrar que está pedindo permissão
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "🎤 Solicitando permissão do microfone..."
      }]);

      // Solicitar permissão de microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Remover mensagem de "solicitando"
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
        
        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop());
        
        // Mostrar que está processando
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "🔄 Transcrevendo áudio..."
        }]);
        
        // Enviar áudio para API
        try {
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          });
          
          // Remover mensagem de "transcrevendo"
          setMessages(prev => prev.slice(0, -1));
          
          if (!response.ok) {
            throw new Error('Erro na transcrição');
          }
          
          const data = await response.json();
          const text = data.text || data.transcript || '';
          
          if (text) {
            // Mostrar mensagem do usuário (texto transcrito)
            const userMessage = { role: "user", content: text };
            setMessages(prev => [...prev, userMessage]);
            
            // Enviar automaticamente para o Serginho
            setIsLoading(true);
            try {
              const currentMessages = [...messages, userMessage];
              const response = await fetch('/api/ai', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  type: 'genius',
                  messages: currentMessages,
                  agentType: 'serginho',
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
          // Remover mensagem de "transcrevendo" se ainda existir
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
      
      // Mostrar que está gravando
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

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleImageAttach = () => {
    imageInputRef.current?.click();
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `📎 Arquivo "${file.name}" recebido! O upload de arquivos ainda não está implementado, mas a interface está pronta. Em breve você poderá enviar documentos! 😊`
      }]);
    }
  };

  const handleImageSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target.result;
        
        // Mostrar imagem enviada
        setMessages(prev => [...prev, {
          role: "user",
          content: `🖼️ Imagem: ${file.name}`,
          image: imageBase64
        }]);
        
        // Analisar imagem com GPT-4 Vision
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
          
          const { description } = await response.json();
          
          // Formatar resposta com padrão
          const formatted = `👀 **Análise da imagem:**\n\n${description}`;
          setMessages(prev => [...prev, {
            role: "assistant",
            content: formatted
          }]);
        } catch (error) {
          console.error('Erro na análise de imagem:', error);
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "❌ Erro ao analisar imagem. Verifique se a API GPT-4 Vision está configurada."
          }]);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraSelect = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const imageBase64 = e.target.result;
        
        // Mostrar foto capturada
        setMessages(prev => [...prev, {
          role: "user",
          content: `📸 Foto capturada`,
          image: imageBase64
        }]);
        
        // Analisar foto com GPT-4 Vision
        setIsLoading(true);
        try {
          const response = await fetch('/api/vision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageBase64 })
          });
          
          if (!response.ok) {
            throw new Error('Erro na análise de foto');
          }
          
          const { description } = await response.json();
          
          // Formatar resposta com padrão
          const formatted = `👀 **Análise da foto:**\n\n${description}`;
          setMessages(prev => [...prev, {
            role: "assistant",
            content: formatted
          }]);
        } catch (error) {
          console.error('Erro na análise de foto:', error);
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "❌ Erro ao analisar foto. Verifique se a API GPT-4 Vision está configurada."
          }]);
        } finally {
          setIsLoading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="serginho-container">
      {/* Header fixo */}
      <div className="serginho-header">
        <div className="header-content">
          <img src="/avatars/serginho.png" alt="Serginho" className="avatar-large" style={{borderRadius: '50%', objectFit: 'cover'}} />
          <div className="header-info">
            <h1>Serginho</h1>
            <p>Orquestrador de IA • Online</p>
            <p style={{fontSize: '0.75rem', color: '#888', marginTop: '2px'}}>🤖 Gemini 2.5 Pro</p>
          </div>
        </div>
      </div>

      {/* Card de boas-vindas - Compacto e fixo */}
      <div className="welcome-container-compact">
        <div className="welcome-card-compact">
          <img src="/avatars/serginho.png" alt="Serginho" className="avatar-compact" />
          <div className="welcome-info-compact">
            <h3>Serginho — Orquestrador</h3>
            <p>Orquestro todos os especialistas para resolver qualquer tarefa 💡</p>
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
              <img src="/avatars/serginho.png" alt="Serginho" className="message-avatar" style={{borderRadius: '50%', objectFit: 'cover'}} />
            )}
            <div className="message-bubble">
              {msg.image && (
                <img 
                  src={msg.image} 
                  alt="Imagem enviada" 
                  className="message-image"
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
            <img src="/avatars/serginho.png" alt="Serginho" className="message-avatar" style={{borderRadius: '50%', objectFit: 'cover'}} />
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
          {/* Botão de imagem/arquivo */}
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
            style={{ 
              color: '#000000', 
              backgroundColor: '#ffffff',
              WebkitTextFillColor: '#000000',
              opacity: 1,
              caretColor: '#000000'
            }}
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

      {/* Inputs escondidos para upload */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
        accept=".pdf,.doc,.docx,.txt,.xlsx,.csv"
      />
      <input
        ref={imageInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleImageSelect}
        accept="image/*"
      />
      <input
        ref={cameraInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleCameraSelect}
        accept="image/*"
        capture="environment"
      />
    </div>
  );
}

