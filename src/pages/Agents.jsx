// src/pages/Agents.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AGENTS from "../data/agents";

export default function Agents() {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return AGENTS;
    return AGENTS.filter((a) => {
      const hay = `${a.name} ${a.role ?? ""} ${a.description ?? ""}`.toLowerCase();
      return hay.includes(term);
    });
  }, [q]);

  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      {/* Barra de busca */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 5,
          paddingBottom: 12,
          marginBottom: 16,
          background: "linear-gradient(180deg, rgba(11,18,32,.98) 40%, rgba(11,18,32,0))",
          backdropFilter: "blur(4px)",
        }}
      >
        <label
          htmlFor="search"
          style={{
            display: "block",
            fontSize: 12,
            opacity: 0.8,
            marginBottom: 6,
          }}
        >
          Buscar agente
        </label>

        <input
          id="search"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="Digite nome, cargo ou palavra-chave…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: 12,
            border: "1px solid rgba(255,255,255,0.14)",
            background: "rgba(255,255,255,0.06)",
            color: "#e6eef5",
            outline: "none",
            fontSize: 16,
            boxShadow:
              "0 1px 0 rgba(0,0,0,0.2), inset 0 1px 2px rgba(0,0,0,0.15)",
          }}
          onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 3px rgba(21,208,212,.35)")}
          onBlur={(e) =>
            (e.currentTarget.style.boxShadow =
              "0 1px 0 rgba(0,0,0,0.2), inset 0 1px 2px rgba(0,0,0,0.15)")
          }
        />

        {/* Contador/feedback */}
        <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
          {filtered.length} agente{filtered.length === 1 ? "" : "s"}
          {q ? ` • filtro: “${q}”` : ""}
        </div>
      </div>

      <h1
        style={{
          margin: "8px 0 16px",
          color: "#15d0d4",
          fontSize: "1.8rem",
          fontWeight: 800,
        }}
      >
        Lista de Agentes
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16,
          paddingBottom: 24, // espaço extra p/ teclado no mobile
        }}
      >
        {filtered.map((a) => (
          <Link
            key={a.id}
            to={`/agent/${a.id}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 12,
                padding: 16,
                boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                transition: "transform .12s ease, box-shadow .12s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.01)";
                e.currentTarget.style.boxShadow = "0 12px 22px rgba(0,0,0,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 8px 18px rgba(0,0,0,0.25)";
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={a.avatar_url}
                  alt={a.name}
                  width={56}
                  height={56}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{a.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{a.role}</div>
                </div>
              </div>

              <p
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  lineHeight: 1.5,
                  color: "#ddd",
                }}
              >
                {a.description}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Mensagem quando nada encontrado */}
      {filtered.length === 0 && (
        <div style={{ marginTop: 24, opacity: 0.75 }}>
          Nada encontrado. Tente outro termo.
        </div>
      )}
    </div>
  );
}
