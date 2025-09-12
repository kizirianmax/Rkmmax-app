// src/pages/Agents.jsx
import React from "react";
import { Link } from "react-router-dom";
import AGENTS from "../data/agents";

export default function Agents() {
  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <h1 style={{ marginBottom: "1rem", color: "#15d0d4", fontSize: 28, textAlign: "center" }}>
        Lista de Agentes
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        {AGENTS.map((a) => (
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
                transition: "transform .12s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.01)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                  <div style={{ fontWeight: 700 }}>
                    {a.name}{" "}
                    {a.principal && (
                      <span
                        style={{
                          marginLeft: 8,
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "rgba(21,208,212,.15)",
                          color: "#15d0d4",
                        }}
                      >
                        Principal
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{a.role}</div>
                </div>
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontSize: 14,
                  lineHeight: 1.4,
                  color: "#ddd",
                }}
              >
                {a.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
