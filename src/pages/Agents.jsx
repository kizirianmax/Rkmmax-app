import React from "react";
import { AGENTS } from "../data/agents";

export default function AgentsPage() {
  return (
    <main style={{ padding: "24px 16px 56px" }}>
      <section className="card" style={{ borderRadius: 16, padding: 24 }}>
        <h1 style={{ fontSize: 32, margin: 0, color: "var(--primary-400,#47b5ff)" }}>
          Lista de Agentes
        </h1>
        <p style={{ opacity: .85, marginTop: 8 }}>
          Escolha um especialista e comece a conversar no app.
        </p>

        <div
          style={{
            display: "grid",
            gap: 16,
            marginTop: 24,
            gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))"
          }}
        >
          {AGENTS.map((a) => (
            <article
              key={a.id}
              style={{
                padding: 16,
                borderRadius: 14,
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.08)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img
                  src={a.avatar_url}
                  alt={a.name}
                  onError={(e)=> (e.currentTarget.style.display = "none")}
                  style={{
                    width: 56, height: 56, borderRadius: "50%",
                    objectFit: "cover", border: "2px solid #f5d061"
                  }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 18 }}>{a.name}</div>
                  <div style={{ opacity: .8, fontSize: 14 }}>{a.role}</div>
                </div>
              </div>

              <p style={{ marginTop: 12, fontSize: 14, lineHeight: 1.5, opacity: .9 }}>
                {a.description}
              </p>

              <button
                style={{
                  width: "100%", marginTop: 12, padding: "12px 16px",
                  borderRadius: 12, border: "none", fontWeight: 700,
                  background: "linear-gradient(90deg,#FFD166,#C08400)",
                  color: "#0b1020", cursor: "pointer"
                }}
                onClick={() => alert(`Abrir chat com ${a.name}`)}
              >
                💬 Chat no app
              </button>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
