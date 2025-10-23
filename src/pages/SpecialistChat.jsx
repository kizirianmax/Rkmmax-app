// src/pages/SpecialistChat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { specialists } from "../config/specialists.js";
import "../pages/Serginho.css";
import "../pages/SpecialistChat.css";

export default function SpecialistChat() {
  const { specialistId } = useParams();
  const navigate = useNavigate();
  const specialist = specialists[specialistId];

  // Se especialista não existe, redirecionar
  useEffect(() => {
    if (!specialist) {
      navigate("/specialists");
    }
  }, [specialist, navigate]);

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Olá! Sou ${specialist?.name}, ${specialist?.description}. Como posso ajudar você hoje?`
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

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
      // Chamar API do especialista
      const response = await fetch('/api/specialist-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
          specialistId: specialistId
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao chamar API');
      }

      const data = await response.json();
      
      // Adicionar resposta da IA
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.response
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

  if (!specialist) {
    return null; // Aguardando redirecionamento
  }

  return (
    <div className="serginho-container">
      {/* Header com info do especialista */}
      <div className="specialist-header">
        <button 
          onClick={() => navigate("/specialists")}
          className="back-button"
        >
          ← Voltar
        </button>
        <div className="specialist-info">
          <img 
            src={specialist.avatar || `/avatars/${specialist.id}.png`}
            alt={specialist.name}
            className="specialist-avatar-header"
            onError={(e) => { 
              e.currentTarget.style.display = 'none'; 
              e.currentTarget.nextSibling.style.display = 'inline-block'; 
            }}
          />
          <span className="specialist-emoji-header" style={{display: 'none', fontSize: '2rem'}}>
            {specialist.emoji}
          </span>
          <div>
            <h1>{specialist.name}</h1>
            <p>{specialist.description}</p>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="chat-container">
        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.role}`}>
              <div className="message-content">
                {msg.role === "assistant" && (
                  <span className="assistant-emoji">{specialist.emoji}</span>
                )}
                <div className="message-text">{msg.content}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="message assistant">
              <div className="message-content">
                <span className="assistant-emoji">{specialist.emoji}</span>
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

        {/* Input Area */}
        <div className="input-container">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Converse com ${specialist.name}...`}
            disabled={isLoading}
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="send-button"
          >
            {isLoading ? "..." : "Enviar"}
          </button>
        </div>
      </div>
    </div>
  );
}

