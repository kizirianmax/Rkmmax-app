// src/pages/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AGENTS from "../data/agents";

export default function Chat() {
  const { id } = useParams();
  const agent = AGENTS.find((a) => a.id === id);

  const [messages, setMessages] = useState([
    { from: "agent", text: `Olá! Sou ${agent?.name}. Como posso ajudar?` }
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  if (!agent) {
    return (
      <div style={{ padding: "1.5rem", color: "#fff" }}>
        <h1 style={{ color: "#ff6b6b" }}>Agente não encontrado</h1>
        <Link to="/agents" style={{ color: "#15d0d4" }}>
          ← Voltar para os agentes
        </Link>
      </div>
    );
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "agent",
          text: `Recebi: “${input}”. Em breve este chat responderá com o suporte oficial (${agent.name}).`,
        },
      ]);
    }, 500);
  };

  return (
    <div style={{ padding: "1rem", maxWidth: 600, margin: "0 auto" }}>
      <div style={{ marginBottom: "1rem" }}>
        <Link to="/agents" style={{ color: "#15d0d4" }}>
          ← Voltar
        </Link>
        <h2 style={{ marginTop: "0.5rem", color: "#fff" }}>
          {agent.name}
        </h2>
        <p style={{ color: "#bbb", marginTop: 4 }}>{agent.title}</p>
      </div>

      {/* Área de mensagens */}
      <div
        ref={listRef}
        style={{
          background: "#111827",
          padding: "1rem",
          borderRadius: 12,
          minHeight: 200,
          maxHeight: "60vh",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              marginBottom: "0.5rem",
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "0.6rem 1rem",
                borderRadius: 12,
                background:
                  msg.from === "user" ? "#0ea5e9" : "#374151",
                color: "#fff",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      {/* Campo de entrada */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          placeholder="Escreva sua mensagem..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "0.75rem",
            borderRadius: 8,
            border: "1px solid #444",
            background: "#1f2937",
            color: "#fff",
          }}
        />
        <button
          onClick={handleSend}
          style={{
            padding: "0.75rem 1.2rem",
            borderRadius: 8,
            background: "#0ea5e9",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
