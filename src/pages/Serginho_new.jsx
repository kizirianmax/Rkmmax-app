// src/pages/Serginho.jsx
import React, { useState, useRef, useEffect } from "react";
import { sendMessageToGroq } from "../services/groqService";
import "./Serginho.css";

export default function Serginho() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o KIZI, seu assistente pessoal de IA. Como posso ajudar você hoje?"
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
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
      // Chamar API Groq
      const aiResponse = await sendMessageToGroq(newMessages);
      
      // Adicionar resposta da IA
      setMessages(prev => [...prev, {
        role: "assistant",
        content: aiResponse
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
        alert("Seu navegador não suporta gravação de áudio. Tente usar Chrome ou Edge.");
        return;
      }

      // Solicitar permissão de microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks = [];
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };
      
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Parar todas as tracks do stream
        stream.getTracks().forEach(track => track.stop());
        
        // Aqui você pode implementar a transcrição de áudio
        // Por enquanto, apenas mostrar mensagem
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "🎤 Áudio gravado! A transcrição de voz ainda não está implementada, mas a gravação funciona perfeitamente. Em breve você poderá falar comigo! 😊"
        }]);
        
        // TODO: Enviar audioBlob para API de transcrição (Whisper, Google Speech-to-Text, etc.)
        /*
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        
        const response = await fetch('/api/transcribe', {
          method: 'POST',
          body: formData
        });
        
        const { text } = await response.json();
        setInput(text);
        */
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error("Erro ao acessar microfone:", error);
      alert("Não foi possível acessar o microfone. Verifique as permissões do navegador.");
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleImageAttach = () => {
    imageInputRef.current?.click();
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

  const handleImageSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `🖼️ Imagem "${file.name}" recebida! O upload de imagens ainda não está implementado, mas a interface está pronta. Em breve você poderá enviar fotos! 😊`
      }]);
    }
  };

  return (
    <div className="serginho-container">
      {/* Header fixo */}
      <div className="serginho-header">
        <div className="header-content">
          <div className="avatar-large">🤖</div>
          <div className="header-info">
            <h1>KIZI</h1>
            <p>Assistente Pessoal • Online</p>
          </div>
        </div>
      </div>

      {/* Card de boas-vindas */}
      <div className="welcome-container">
        <div className="welcome-card">
          <div className="welcome-header">
            <div className="avatar-xl">🤖</div>
            <div>
              <h2>KIZI — Assistente Pessoal</h2>
              <p>Powered by Groq AI (Llama 3.3 70B)</p>
            </div>
          </div>
          <p className="welcome-text">
            Olá! Sou seu assistente pessoal de IA. Posso ajudar com qualquer coisa: responder perguntas, criar conteúdo, resolver problemas e muito mais. Pode me perguntar qualquer coisa! 💡
          </p>
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
              <div className="message-avatar">🤖</div>
            )}
            <div className="message-bubble">
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message message-assistant">
            <div className="message-avatar">🤖</div>
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
          {/* Botões de ação */}
          <div className="action-buttons">
            <button
              className="action-btn"
              onClick={handleFileAttach}
              title="Anexar arquivo"
            >
              📎
            </button>
            <button
              className="action-btn"
              onClick={handleImageAttach}
              title="Enviar imagem"
            >
              🖼️
            </button>
          </div>

          {/* Input de texto */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="message-input"
          />

          {/* Botão de voz */}
          <button
            className={`voice-btn ${isRecording ? 'recording' : ''}`}
            onClick={handleVoiceInput}
            title={isRecording ? "Parar gravação" : "Gravar áudio"}
          >
            🎤
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
    </div>
  );
}

