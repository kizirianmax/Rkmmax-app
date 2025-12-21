// src/pages/Serginho.jsx
import React, { useState, useRef, useEffect } from "react";
import "./Serginho.css";
import MarkdownMessage from "../components/MarkdownMessage";
import { useConversationMemory } from "../hooks/useConversationMemory";
import { detectToolSuggestion, appendToolSuggestion, shouldSuggestTool, markToolSuggested } from "../lib/smartSuggestions";

export default function Serginho() {
  // Hook de memória de conversas
  const memory = useConversationMemory('serginho');
  const [showHistory, setShowHistory] = useState(false);
  
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
  // Inicializar conversa - criar nova ou carregar existente
  useEffect(() => {
    if (memory.conversations.length === 0) {
      // Primeira vez - criar nova conversa
      memory.createNewConversation();
    } else if (memory.currentConversationId) {
      // Carregar mensagens da conversa atual
      const currentConv = memory.getCurrentConversation();
      if (currentConv && currentConv.messages.length > 0) {
        setMessages([
          {
            role: "assistant",
            content: "Olá! Sou o KIZI 2.5 Pro operando como Serginho. Continuando nossa conversa anterior..."
          },
          ...currentConv.messages
        ]);
      }
    }
  }, [memory.conversations.length, memory.currentConversationId]);

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
    
    // Salvar mensagem do usuário na memória
    memory.addMessage({ role: "user", content: userMessage });
    
    // Detectar sugestão de ferramenta
    const toolSuggestion = detectToolSuggestion(userMessage);

    try {
      // Obter contexto das conversas anteriores
      const contextSummary = memory.getContextSummary();
      
      // Preparar mensagens com contexto
      let messagesWithContext = newMessages;
      if (contextSummary && messages.length <= 2) {
        // Só adiciona contexto se for início de conversa
        messagesWithContext = [
          { role: "system", content: `Contexto de conversas anteriores:\n${contextSummary}` },
          ...newMessages
        ];
      }
      
      // Chamar API com Gemini Pro 2.5 (nível ChatGPT-5)
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'genius',         // Endpoint unificado
          messages: messagesWithContext,
          agentType: 'serginho',  // Prompts de gênio do Serginho
          mode: 'OTIMIZADO'       // Otimização de custo ativada
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      let aiResponse = data.response;
      
      if (!aiResponse || aiResponse.trim() === "") {
        throw new Error("Resposta vazia da IA");
      }
      
      // Remover bloco thinking
      let cleanResponse = removeThinking(aiResponse);
      
      // Adicionar sugestão de ferramenta se detectada e não sugerida recentemente
      if (toolSuggestion && shouldSuggestTool(toolSuggestion.toolId)) {
        cleanResponse = appendToolSuggestion(cleanResponse, toolSuggestion);
        markToolSuggested(toolSuggestion.toolId);
      }
      
      // Salvar resposta na memória
      memory.addMessage({ role: "assistant", content: cleanResponse });
      
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
            <div style={{display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap'}}>
              <span style={{fontSize: '0.65rem', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '2px 6px', borderRadius: '10px'}}>🧠 KIZI 2.5 Pro</span>
              <span style={{fontSize: '0.65rem', background: 'linear-gradient(135deg, #f59e0b, #ef4444)', color: 'white', padding: '2px 6px', borderRadius: '10px'}}>🚀 KIZI Speed</span>
              <span style={{fontSize: '0.65rem', background: 'linear-gradient(135deg, #10b981, #06b6d4)', color: 'white', padding: '2px 6px', borderRadius: '10px'}}>⚡ KIZI Flash</span>
            </div>
          </div>
        </div>
        {/* Botões de memória */}
        <div style={{display: 'flex', gap: '8px'}}>
          <button
            onClick={() => {
              memory.createNewConversation();
              setMessages([{
                role: "assistant",
                content: "Olá! Sou o KIZI 2.5 Pro operando como Serginho. Nova conversa iniciada! Como posso ajudar?"
              }]);
            }}
            style={{
              background: 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Nova conversa"
          >
            ➕ Nova
          </button>
          <button
            onClick={() => setShowHistory(!showHistory)}
            style={{
              background: showHistory ? 'rgba(99, 102, 241, 0.4)' : 'rgba(99, 102, 241, 0.2)',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: 'white',
              fontSize: '0.75rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
            title="Histórico de conversas"
          >
            📜 {memory.conversations.length}
          </button>
        </div>
      </div>
      
      {/* Painel de histórico */}
      {showHistory && (
        <div style={{
          position: 'absolute',
          top: '80px',
          right: '10px',
          background: 'rgba(30, 30, 50, 0.95)',
          border: '1px solid rgba(99, 102, 241, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          maxHeight: '300px',
          overflowY: 'auto',
          zIndex: 1000,
          minWidth: '250px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <h4 style={{margin: '0 0 10px 0', color: 'white', fontSize: '0.9rem'}}>📜 Conversas Salvas</h4>
          {memory.conversations.length === 0 ? (
            <p style={{color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem'}}>Nenhuma conversa salva</p>
          ) : (
            memory.conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => {
                  memory.switchConversation(conv.id);
                  const currentConv = memory.conversations.find(c => c.id === conv.id);
                  if (currentConv) {
                    setMessages([{
                      role: "assistant",
                      content: "Olá! Continuando nossa conversa..."
                    }, ...currentConv.messages]);
                  }
                  setShowHistory(false);
                }}
                style={{
                  padding: '8px 10px',
                  marginBottom: '6px',
                  background: conv.id === memory.currentConversationId ? 'rgba(99, 102, 241, 0.3)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{flex: 1, overflow: 'hidden'}}>
                  <p style={{margin: 0, color: 'white', fontSize: '0.8rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {conv.title}
                  </p>
                  <p style={{margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem'}}>
                    {conv.messages.length} msgs • {new Date(conv.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    memory.deleteConversation(conv.id);
                  }}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    color: '#ef4444',
                    fontSize: '0.7rem',
                    cursor: 'pointer'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      )}

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

