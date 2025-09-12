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
  const contentRef = useRef(null);

  useEffect(() => {
    // rola para o fim sempre que chegar msg nova
    const el = contentRef.current;
    if (!el) return;
    // tenta achar a última bolha dentro do content
    const last = el.querySelector("[data-msg]:last-child");
    last?.scrollIntoView({ block: "end", behavior: "smooth" });
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
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          from: "agent",
          text: `Recebi: “${text}”. Em breve este chat responderá com a IA do ${agent.name}.`,
        },
      ]);
    }, 400);
  }

  return (
    // FRAME: tela inteira, sem rolagem na página
    <div
      style={{
        height: "100svh",
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        color: "#e6eef5",
      }}
    >
      {/* COLUNA CENTRAL */}
      <div
        style={{
          width: "100%",
          maxWidth: 720,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* BARRA SUPERIOR */}
        <div
          style={{
            height: 48,
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "0 12px",
            background: "rgba(255,255,255,0.06)",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            flexShrink: 0,
          }}
        >
          <Link to={`/agent/${agent.id}`} style={{ color: "#15d0d4" }}>← Voltar</Link>
          <div style={{ flex: 1 }} />
          <Link to="/agents" style={{ color: "#e6eef5", opacity: 0.9 }}>Agentes</Link>
        </div>

        {/* CONTENT: rola tudo daqui pra baixo (cabeçalho + mensagens) */}
        <div
          ref={contentRef}
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 12px 12px",
            overscrollBehavior: "contain",
          }}
        >
          {/* Cabeçalho do agente (STICKY DENTRO DO MESMO CONTAINER) */}
          <div
            style={{
              position: "sticky",
              top: 0,
              zIndex: 2,
              background: "linear-gradient(180deg, rgba(15,23,42,.98), rgba(15,23,42,.85))",
              borderBottom: "1px solid rgba(255,255,255,.08)",
              padding: "10px 0 8px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={agent.avatar_url}
                alt={agent.name}
                width={48}
                height={48}
                style={{ borderRadius: "50%", objectFit: "cover", flexShrink: 0 }}
              />
              <div>
                <div style={{ fontWeight: 800 }}>{agent.name}</div>
                <div style={{ fontSize: 12, opacity: 0.8 }}>{agent.role}</div>
              </div>
            </div>
          </div>

          {/* Caixa das mensagens (só estética; quem rola é o contentRef) */}
          <div
            style={{
              marginTop: 12,
              background: "rgba(255,255,255,.06)",
              borderRadius: 12,
              padding: 12,
              boxShadow: "0 8px 18px rgba(0,0,0,.25)",
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                data-msg
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

          {/* Espaço para não ficar colado no input quando rolar ao fim */}
          <div style={{ height: 12 }} />
        </div>

        {/* INPUT: fixo embaixo do frame */}
        <div
          style={{
            position: "sticky",
            bottom: 0,
            padding: `12px 12px calc(12px + env(safe-area-inset-bottom, 0px))`,
            background: "linear-gradient(0deg, rgba(15,23,42,.98), rgba(15,23,42,.85))",
            borderTop: "1px solid rgba(255,255,255,.08)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Escreva sua mensagem…"
              style={{
                flex: 1,
                padding: "12px",
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
                padding: "12px 16px",
                borderRadius: 10,
                border: "1px solid rgba(21,208,212,.35)",
                background: "rgba(21,208,212,.15)",
                color: "#e6eef5",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              Enviar
            </button>
          </div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 6 }}>
            * Protótipo offline. Depois conectamos à sua API/IA (Supabase/Node).
          </div>
        </div>
      </div>
    </div>
  );
}
