// src/pages/Serginho.jsx
import React, { useState, useRef, useEffect } from "react";

export default function Serginho() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Olá! Sou o Serginho, seu orquestrador de IA. Como posso ajudar você hoje?"
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
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simular resposta (substituir por chamada real à API)
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Entendi sua solicitação! Estou analisando e vou orquestrar os especialistas necessários para resolver isso da melhor forma possível. 🤖"
      }]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      background: "linear-gradient(to bottom, #f8fafc 0%, #e2e8f0 100%)",
      position: "relative"
    }}>
      {/* Header fixo */}
      <div style={{
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        padding: "16px 20px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        position: "sticky",
        top: 0,
        zIndex: 10
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          maxWidth: 900,
          margin: "0 auto"
        }}>
          <div style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 24,
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.3)"
          }}>
            🤖
          </div>
          <div>
            <h1 style={{
              fontSize: 20,
              fontWeight: 700,
              color: "#1e293b",
              margin: 0,
              lineHeight: 1.2
            }}>
              Serginho
            </h1>
            <p style={{
              fontSize: 13,
              color: "#64748b",
              margin: 0
            }}>
              Orquestrador de IA • Online
            </p>
          </div>
        </div>
      </div>

      {/* Card de boas-vindas */}
      <div style={{
        maxWidth: 900,
        margin: "24px auto 0",
        padding: "0 20px",
        width: "100%"
      }}>
        <div style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          marginBottom: 24,
          border: "1px solid #e2e8f0"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 16
          }}>
            <div style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)"
            }}>
              🤖
            </div>
            <div>
              <h2 style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#1e293b",
                margin: 0,
                marginBottom: 4
              }}>
                Serginho — Orquestrador
              </h2>
              <p style={{
                fontSize: 14,
                color: "#64748b",
                margin: 0
              }}>
                Agente especial e generalista
              </p>
            </div>
          </div>
          <p style={{
            fontSize: 15,
            color: "#475569",
            lineHeight: 1.6,
            margin: 0
          }}>
            Orquestro todos os especialistas, supervisiono e articulo as interações para resolver qualquer tarefa. Pode me perguntar qualquer coisa! 💡
          </p>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "0 20px 120px",
        maxWidth: 900,
        margin: "0 auto",
        width: "100%"
      }}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              marginBottom: 16,
              animation: "fadeIn 0.3s ease-in"
            }}
          >
            {msg.role === "assistant" && (
              <div style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                marginRight: 8,
                flexShrink: 0,
                boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)"
              }}>
                🤖
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              padding: "14px 18px",
              borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
              background: msg.role === "user" 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "white",
              color: msg.role === "user" ? "white" : "#1e293b",
              fontSize: 15,
              lineHeight: 1.6,
              boxShadow: msg.role === "user"
                ? "0 4px 12px rgba(102, 126, 234, 0.3)"
                : "0 2px 8px rgba(0,0,0,0.08)",
              border: msg.role === "user" ? "none" : "1px solid #e2e8f0"
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{
            display: "flex",
            justifyContent: "flex-start",
            marginBottom: 16
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              marginRight: 8,
              flexShrink: 0
            }}>
              🤖
            </div>
            <div style={{
              padding: "14px 18px",
              borderRadius: "20px 20px 20px 4px",
              background: "white",
              color: "#64748b",
              fontSize: 15,
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0"
            }}>
              <div style={{
                display: "flex",
                gap: 4,
                alignItems: "center"
              }}>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#94a3b8",
                  animation: "pulse 1.4s ease-in-out infinite"
                }}></span>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#94a3b8",
                  animation: "pulse 1.4s ease-in-out 0.2s infinite"
                }}></span>
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#94a3b8",
                  animation: "pulse 1.4s ease-in-out 0.4s infinite"
                }}></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input fixo na parte inferior */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "white",
        borderTop: "1px solid #e2e8f0",
        padding: "16px 20px",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.05)",
        zIndex: 10
      }}>
        <div style={{
          display: "flex",
          gap: 12,
          maxWidth: 900,
          margin: "0 auto",
          alignItems: "center"
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
              padding: "14px 20px",
              borderRadius: 28,
              border: "2px solid #e2e8f0",
              fontSize: 15,
              outline: "none",
              transition: "all 0.2s",
              background: "#f8fafc"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#667eea";
              e.target.style.background = "white";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#e2e8f0";
              e.target.style.background = "#f8fafc";
            }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: input.trim() && !isLoading 
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
                : "#cbd5e1",
              color: "white",
              border: "none",
              fontSize: 20,
              fontWeight: 600,
              cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: input.trim() && !isLoading 
                ? "0 4px 12px rgba(102, 126, 234, 0.4)" 
                : "none",
              flexShrink: 0
            }}
          >
            ↑
          </button>
        </div>
      </div>

      {/* Animações CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

