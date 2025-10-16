// src/pages/Help.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Help() {
  const [status, setStatus] = useState({ ok: null, uptime: null });

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch(() => setStatus({ ok: false }));
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
      {/* Status */}
      <section style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>Status & Ajuda</h1>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: 12,
            background: status.ok ? "#d1fae5" : "#fee2e2",
            borderRadius: 8,
            marginTop: 16,
          }}
        >
          <span style={{ fontSize: 20 }}>{status.ok ? "✅" : "⚠️"}</span>
          <span style={{ fontWeight: 600 }}>
            {status.ok === null
              ? "Verificando status..."
              : status.ok
              ? "Todos os sistemas operacionais"
              : "Problemas detectados"}
          </span>
        </div>
        {status.uptime !== null && (
          <p style={{ marginTop: 8, fontSize: 14, opacity: 0.7 }}>
            Uptime: {Math.floor(status.uptime / 60)} minutos
          </p>
        )}
      </section>

      {/* FAQ */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Perguntas Frequentes</h2>
        
        <details style={detailsStyle}>
          <summary style={summaryStyle}>Como funciona o plano Premium?</summary>
          <p style={answerStyle}>
            O plano Premium oferece acesso a GPT-5 Standard, GPT-4.1 Mini, 12 especialistas e
            suporte prioritário. Você pode assinar através da página de{" "}
            <Link to="/pricing">Planos</Link>.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Como cancelar minha assinatura?</summary>
          <p style={answerStyle}>
            Você pode gerenciar sua assinatura diretamente no portal do Stripe. Acesse sua{" "}
            <Link to="/account">Conta</Link> para mais informações.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Meus dados estão seguros?</summary>
          <p style={answerStyle}>
            Sim! Utilizamos criptografia de ponta a ponta, autenticação via Supabase e
            processamento de pagamentos seguro via Stripe. Seus dados nunca são compartilhados
            com terceiros.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Como reportar um bug?</summary>
          <p style={answerStyle}>
            Use o botão "🐛 Feedback" no canto inferior direito da tela. Seu feedback será
            enviado diretamente para nossa equipe e criará automaticamente um issue no GitHub.
          </p>
        </details>

        <details style={detailsStyle}>
          <summary style={summaryStyle}>Qual a diferença entre os agentes?</summary>
          <p style={answerStyle}>
            Cada agente é especializado em uma área específica (marketing, código, design, etc.).
            O Serginho é o orquestrador principal que pode delegar tarefas aos especialistas
            quando necessário.
          </p>
        </details>
      </section>

      {/* Contact */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Contato</h2>
        <p style={{ marginBottom: 12 }}>
          Precisa de ajuda adicional? Entre em contato conosco:
        </p>
        <ul style={{ lineHeight: 1.8 }}>
          <li>
            📧 E-mail:{" "}
            <a href="mailto:support@rkmmax.com" style={{ color: "#6366f1" }}>
              support@rkmmax.com
            </a>
          </li>
          <li>
            🐛 GitHub Issues:{" "}
            <a
              href="https://github.com/kizirianmax/Rkmmax-app/issues"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#6366f1" }}
            >
              Reportar problema
            </a>
          </li>
          <li>
            💬 Use o botão de feedback no canto da tela para reportar bugs ou dar sugestões
          </li>
        </ul>
      </section>

      {/* Resources */}
      <section>
        <h2 style={{ fontSize: 22, marginBottom: 16 }}>Recursos</h2>
        <div style={{ display: "grid", gap: 12 }}>
          <Link to="/" style={linkCardStyle}>
            🏠 Página Inicial
          </Link>
          <Link to="/agents" style={linkCardStyle}>
            🤖 Explorar Especialistas
          </Link>
          <Link to="/pricing" style={linkCardStyle}>
            💳 Ver Planos
          </Link>
          <a
            href="https://github.com/kizirianmax/Rkmmax-app"
            target="_blank"
            rel="noopener noreferrer"
            style={linkCardStyle}
          >
            📦 Repositório GitHub
          </a>
        </div>
      </section>
    </div>
  );
}

const detailsStyle = {
  marginBottom: 12,
  padding: 16,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
};

const summaryStyle = {
  fontWeight: 600,
  cursor: "pointer",
  fontSize: 15,
};

const answerStyle = {
  marginTop: 12,
  lineHeight: 1.6,
  opacity: 0.9,
};

const linkCardStyle = {
  display: "block",
  padding: 12,
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  textDecoration: "none",
  color: "inherit",
  fontWeight: 500,
  transition: "background 0.2s",
};

