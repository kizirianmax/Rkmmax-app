// src/pages/Chat.jsx
import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import AGENTS from "../data/agents";

export default function Chat() {
  const { id } = useParams();
  const agent = AGENTS.find((a) => a.id === id);

  const [messages, setMessages] = useState([
    { from: "agent", text: `Olá! Sou ${agent?.name}. Como posso ajudar?` },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  if (!agent) {
    return (
      <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
        <h1 style={{ color: "#ff6b6b" }}>Agente não encontrado</h1>
        <Link to="/agents" style={{ color: "#15d0d4" }}>← Voltar</Link>
      </div>
    );
  }

  function send() {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setInput("");
    // resposta simples provisória; depois conectamos na sua IA
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "agent",
          text:
            `Recebi: “${text}”. Em breve este chat responderá com a IA do ${agent.name}.`,
        },
      ]);
    }, 400);
  }

  function onKey(e) {
    if (e.key === "Enter") send();
  }

  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5", minHeight: "100vh" }}>
      <Link to={`/agent/${agent.id}`} style={{ color: "#15d0d4" }}>← Voltar</Link>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
        <img
          src={agent.avatar_url}
          alt={agent.name}
          width={48}
          height={48}
          style={{ borderRadius: "50%", objectFit: "cover" }}
        />
        <div>
          <div style={{ fontWeight: 800 }}>{agent.name}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{agent.role}</div>
        </div>
      </div>

      <div
        ref={listRef}
        style={{
          marginTop: 16,
          background: "rgba(255,255,255,.06)",
          borderRadius: 12,
          padding: 12,
          height: "55vh",
          overflowY: "auto",
          boxShadow: "0 8px 18px rgba(0,0,0,.25)",
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              justifyContent: m.from === "user" ? "flex-end" : "flex-start",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                maxWidth: "85%",
                padding: "8px 12px",
                borderRadius: 10,
                background:
                  m.from === "user" ? "rgba(21,208,212,.15)" : "rgba(255,255,255,.06)",
                border:
                  m.from === "user"
                    ? "1px solid rgba(21,208,212,.25)"
                    : "1px solid rgba(255,255,255,.08)",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Escreva sua mensagem…"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,.15)",
            background: "rgba(0,0,0,.25)",
            color: "#e6eef5",
            outline: "none",
          }}
        />
        <button
          onClick={send}
          style={{
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid rgba(21,208,212,.35)",
            background: "rgba(21,208,212,.15)",
            color: "#e6eef5",
            fontWeight: 700,
          }}
        >
          Enviar
        </button>
      </div>

      <div style={{ fontSize: 12, opacity: 0.7, marginTop: 8 }}>
        * Protótipo offline. Depois conectamos à sua API/IA (Supabase/Node).
      </div>
    </div>
  );
}
