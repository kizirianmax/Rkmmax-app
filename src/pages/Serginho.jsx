// src/pages/Serginho.jsx
import React, { useState } from "react";

export default function Serginho() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o Serginho, seu orquestrador de IA. Como posso ajudar você hoje?"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simular resposta (substituir por chamada real à API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Entendi sua solicitação! Estou analisando e vou orquestrar os especialistas necessários para resolver isso. (Interface de chat funcional - integração com API em desenvolvimento)"
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "calc(100vh - 80px)",
      maxWidth: 900,
      margin: "0 auto",
      padding: 16
    }}>
      {/* Header */}
      <div style={{
        padding: "20px 0",
        borderBottom: "2px solid #e5e7eb",
        marginBottom: 16
      }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          marginBottom: 8,
          color: "#111"
        }}>
          🤖 Serginho — Orquestrador
        </h1>
        <p style={{ color: "#64748b", fontSize: 14 }}>
          Agente especial e generalista. Orquestra os especialistas para resolver qualquer tarefa.
        </p>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        marginBottom: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start"
            }}
          >
            <div style={{
              maxWidth: "75%",
              padding: "12px 16px",
              borderRadius: 16,
              background: msg.role === "user" ? "#3b82f6" : "#f1f5f9",
              color: msg.role === "user" ? "white" : "#1e293b",
              fontSize: 15,
              lineHeight: 1.5
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", justifyContent: "flex-start" }}>
            <div style={{
              padding: "12px 16px",
              borderRadius: 16,
              background: "#f1f5f9",
              color: "#64748b",
              fontSize: 15
            }}>
              Serginho está pensando...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        display: "flex",
        gap: 8,
        padding: "12px 0",
        borderTop: "2px solid #e5e7eb"
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          placeholder="Digite sua mensagem..."
          disabled={isLoading}
          style={{
            flex: 1,
            padding: "12px 16px",
            borderRadius: 24,
            border: "2px solid #e5e7eb",
            fontSize: 15,
            outline: "none",
            transition: "border-color 0.2s"
          }}
          onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
          onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          style={{
            padding: "12px 24px",
            borderRadius: 24,
            background: input.trim() && !isLoading ? "#3b82f6" : "#cbd5e1",
            color: "white",
            border: "none",
            fontSize: 15,
            fontWeight: 600,
            cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
            transition: "all 0.2s"
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

