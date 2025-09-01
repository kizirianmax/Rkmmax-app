// src/pages/AgentDetail.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import agents from "../data/agents";

// Paletas e ícones (iguais da Home)
const COLORS = {
  emo: { border: "#9AE6B4", bg: "#F0FFF4" },
  didak: { border: "#90CDF4", bg: "#EBF8FF" },
  finna: { border: "#68D391", bg: "#F0FFF4" },
  care: { border: "#FEB2B2", bg: "#FFF5F5" },
  criar: { border: "#F6E05E", bg: "#FFFAF0" },
  code: { border: "#A0AEC0", bg: "#F7FAFC" },
  talky: { border: "#B794F4", bg: "#FAF5FF" },
  focus: { border: "#FC8181", bg: "#FFF5F5" },
  bizu: { border: "#63B3ED", bg: "#EBF8FF" },
  legalis: { border: "#81E6D9", bg: "#E6FFFA" },
  planx: { border: "#F6E05E", bg: "#FFFEF0" },
  orac: { border: "#C4B5FD", bg: "#F5F3FF" },
  serginho: { border: "#FBD38D", bg: "#FFFAF0" },
};

const ICONS = {
  emo: "💙",
  didak: "📘",
  finna: "💸",
  care: "🩺",
  criar: "✨",
  code: "💻",
  talky: "💬",
  focus: "🎯",
  bizu: "📝",
  legalis: "⚖️",
  planx: "🗺️",
  orac: "🔮",
  serginho: "🧩",
};

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  // ---------- estilos ----------
  const container = { maxWidth: 980, margin: "0 auto", padding: "24px 16px" };
  const titleRow = { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 };
  const title = { fontSize: 32, lineHeight: 1.2, fontWeight: 800 };
  const subtitle = { color: "#4B5563", fontSize: 16, lineHeight: 1.6, marginBottom: 20 };
  const card = (id) => ({
    background: COLORS[id]?.bg || "#fff",
    border: `1px solid ${COLORS[id]?.border || "#e5e7eb"}`,
    borderRadius: 12,
    padding: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,.04)",
  });
  const backBtn = {
    display: "inline-block",
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #cbd5e1",
    textDecoration: "none",
    color: "#1D4ED8",
    background: "#F8FAFC",
    transition: "transform .15s ease, box-shadow .15s ease",
  };

  // ---------- chat (estado + persistência local) ----------
  const storageKey = `chat_${id}`;
  const [messages, setMessages] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef(null);

  // persiste o histórico por agente
  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    } catch {}
  }, [messages, storageKey]);

  // auto-scroll para a última mensagem
  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function pushMessage(role, text) {
    setMessages((prev) => [...prev, { role, text, ts: Date.now() }]);
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    pushMessage("user", text);
    setSending(true);

    // resposta fictícia (simulação); depois podemos plugar uma API real
    const reply =
      agent.id === "serginho"
        ? `Fala! Eu sou o ${agent.name}. Entendi: “${text}”. Vou te ajudar do meu jeitinho 😎🚀`
        : `${agent.name} diz: recebi “${text}”. Como posso detalhar isso pra você?`;

    // pequeno delay pra parecer “digitando”
    await new Promise((r) => setTimeout(r, 450));
    pushMessage("assistant", reply);
    setSending(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!agent) {
    return (
      <main style={container}>
        <h1 style={{ ...title, color: "#DC2626" }}>Agente não encontrado</h1>
        <Link to="/" style={backBtn}>Voltar para a Home</Link>
      </main>
    );
  }

  return (
    <main style={container}>
      <style>{`
        .back:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
        .back:active { transform: translateY(0) scale(.99); }
        .chip { display:inline-flex; align-items:center; gap:8px; font-size:13px; padding:6px 10px;
                border-radius:999px; border:1px solid #e5e7eb; background:#fff; color:#374151; }
        .msgList { height: 48vh; max-height: 420px; overflow:auto; padding: 8px 4px; }
        .bubble { padding:10px 12px; border-radius:12px; margin:6px 0; max-width: 86%; line-height:1.5; }
        .user   { background:#1D4ED8; color:white; margin-left:auto; border-top-right-radius:6px; }
        .bot    { background:#F1F5F9; color:#111827; border:1px solid #E5E7EB; border-top-left-radius:6px; }
        .inputWrap { display:flex; gap:10px; margin-top:10px; align-items:flex-end; }
        .textarea { flex:1; min-height:44px; max-height:120px; padding:10px 12px; border:1px solid #CBD5E1;
                    border-radius:10px; resize:vertical; font-size:15px; }
        .sendBtn { padding:10px 14px; border-radius:10px; border:1px solid #2563EB; background:#2563EB; color:#fff;
                   font-weight:600; }
        .sendBtn:disabled{ opacity:.6; }
      `}</style>

      {/* Cabeçalho */}
      <div style={titleRow}>
        <div style={{ fontSize: 26 }}>{ICONS[agent.id] || "🤖"}</div>
        <h1 style={title}>{agent.name}</h1>
      </div>
      <p style={subtitle}>{agent.description}</p>

      {/* Card de boas-vindas */}
      <section style={card(agent.id)}>
        <div className="chip">
          <span>{ICONS[agent.id] || "🤖"}</span>
          <strong>{agent.name}</strong>
        </div>

        <p style={{ color: "#374151", fontSize: 15, lineHeight: 1.7, marginTop: 12 }}>
          Fale com o <strong>{agent.name}</strong> usando o chat abaixo.  
          Este é um protótipo local (sem servidor). Depois podemos conectar a um backend/LLM real.
        </p>

        {agent.id === "serginho" && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              background: "#FEF3C7",
              border: "1px solid #FCD34D",
              borderRadius: 10,
            }}
          >
            <p style={{ color: "#92400E", fontWeight: 600 }}>
              👋 Sou o Serginho! Bora construir coisa boa no RKMMax 🚀
            </p>
          </div>
        )}
      </section>

      {/* Chat */}
      <section style={{ marginTop: 16, border: "1px solid #E5E7EB", borderRadius: 12, padding: 12 }}>
        <div ref={listRef} className="msgList">
          {messages.length === 0 && (
            <p style={{ color: "#6B7280", fontSize: 14 }}>
              Dica: descreva sua tarefa ou faça uma pergunta. Ex.: “{agent.name}, me ajude com…”
            </p>
          )}
          {messages.map((m, i) => (
            <div
              key={m.ts + "_" + i}
              className={`bubble ${m.role === "user" ? "user" : "bot"}`}
              style={{ textAlign: m.role === "user" ? "right" : "left" }}
            >
              {m.text}
            </div>
          ))}
          {sending && (
            <div className="bubble bot" aria-live="polite">
              {agent.name} está digitando…
            </div>
          )}
        </div>

        <div className="inputWrap">
          <textarea
            className="textarea"
            placeholder={`Envie uma mensagem para ${agent.name}...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="sendBtn" onClick={handleSend} disabled={sending || !input.trim()}>
            Enviar
          </button>
        </div>
      </section>

      <Link to="/" className="back" style={backBtn}>Voltar para a Home</Link>
    </main>
  );
}
