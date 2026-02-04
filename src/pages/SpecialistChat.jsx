// src/pages/SpecialistChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { specialists } from "../config/specialists.js";
import "./Serginho.css";
import MarkdownMessage from "../components/MarkdownMessage.jsx";

export default function SpecialistChat() {
  const { specialistId } = useParams();
  const navigate = useNavigate();
  const specialist = specialists[specialistId];
  const imageInputRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  // Se especialista não existe, redirecionar
  useEffect(() => {
    if (!specialist) {
      navigate("/specialists");
    }
  }, [specialist, navigate]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Olá! Sou o KIZI 2.5 Pro operando como ${specialist?.name}. ${specialist?.description}. Como posso ajudar você hoje?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef(null);

  // Função para remover bloco <thinking> das respostas
  const removeThinking = (text) => {
    if (!text) return text;
    return text.replace(/<thinking>[\s\S]*?<\/thinking>/gi, '').trim();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll para o topo ao carregar a página e prevenir scroll quando teclado abre
  useEffect(() => {
    document.documentElement.classList.add('serginho-page');
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
    return () => {
      document.documentElement.classList.remove('serginho-page');
    };
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      scrollToBottom();
    }
  }, [messages]);

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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          type: 'specialist',
          specialistId: specialistId
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao chamar API');
      }

      const data = await response.json();
      const cleanResponse = removeThinking(data.response);
      
      setMessages(prev => [...prev, {
        role: "assistant",
        content: cleanResponse
      }]);
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente. 😔"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
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
          content: "❌ Seu navegador não suporta gravação de áudio."
        }]);
        return;
      }

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
                  messages: currentMessages,
                  type: 'specialist',
                  specialistId: specialistId
                }),
              });

              if (!response.ok) {
                throw new Error(`Erro na API: ${response.status}`);
              }

              const data = await response.json();
              const cleanResponse = removeThinking(data.response);
              
              setMessages(prev => [...prev, {
                role: "assistant",
                content: cleanResponse
              }]);
            } catch (error) {
              console.error("Erro ao enviar mensagem de voz:", error);
              setMessages(prev => [...prev, {
                role: "assistant",
                content: `❌ Erro ao processar: ${error?.message || "erro desconhecido"}`
              }]);
            } finally {
              setIsLoading(false);
            }
          } else {
            setMessages(prev => [...prev, {
              role: "assistant",
              content: "⚠️ Não foi possível transcrever o áudio."
            }]);
          }
        } catch (error) {
          console.error('Erro na transcrição:', error);
          setMessages(prev => [...prev, {
            role: "assistant",
            content: "❌ Erro ao transcrever. Tente novamente."
          }]);
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
        content: `❌ Não foi possível acessar o microfone.`
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

  if (!specialist) {
    return null;
  }

  return (
    <div className="serginho-container">
      {/* Header */}
      <div className="serginho-header">
        <div className="header-content">
          <button 
            onClick={() => navigate("/specialists")}
            className="back-btn"
            style={{
              background: 'rgba(255,255,255,0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 12px',
              color: 'white',
              cursor: 'pointer',
              marginRight: '12px',
              fontSize: '14px'
            }}
          >
            ← Voltar
          </button>
          <img 
            src={`${specialist.avatar || `/avatars/${specialist.id}.png`}?v=2`}
            alt={specialist.name}
            className="avatar-large"
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
            }}
          />
          <div className="header-info">
            <h1>{specialist.name}</h1>
            <p>{specialist.description}</p>
            <div style={{display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap'}}>
              <span style={{fontSize: '0.65rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '2px 6px', borderRadius: '10px'}}>🧠 KIZI 2.5 Pro</span>
              <span style={{fontSize: '0.65rem', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', padding: '2px 6px', borderRadius: '10px'}}>🚀 KIZI Speed</span>
              <span style={{fontSize: '0.65rem', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', padding: '2px 6px', borderRadius: '10px'}}>⚡ KIZI Flash</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Card */}
      <div className="welcome-container-compact">
        <div className="welcome-card-compact">
          <img 
            src={`${specialist.avatar || `/avatars/${specialist.id}.png`}?v=2`}
            alt={specialist.name}
            className="avatar-compact"
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
            }}
          />
          <div className="welcome-info-compact">
            <h3>{specialist.name}</h3>
            <p>{specialist.description}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message message-${msg.role === "user" ? "user" : "assistant"}`}>
            {msg.role === "assistant" && (
              <img 
                src={`${specialist.avatar || `/avatars/${specialist.id}.png`}?v=2`}
                alt={specialist.name}
                className="message-avatar"
                onError={(e) => { 
                  e.currentTarget.style.display = 'none'; 
                }}
              />
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
            <img 
              src={`${specialist.avatar || `/avatars/${specialist.id}.png`}?v=2`}
              alt={specialist.name}
              className="message-avatar"
              onError={(e) => { 
                e.currentTarget.style.display = 'none'; 
              }}
            />
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
            onClick={handleImageAttach}
            title="Enviar imagem"
          >
            🖼️
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Converse com ${specialist.name}...`}
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

          <button
            className={`icon-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
            title="Gravar áudio"
          >
            🎙️
          </button>

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
