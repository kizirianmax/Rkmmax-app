// src/pages/Home.jsx
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main style={{ padding: "20px", textAlign: "center" }}>
      <h1>Bem-vindo ao RKMMax 🚀</h1>
      <p style={{ marginBottom: "20px" }}>
        Seu assistente inteligente com 12 agentes prontos para ajudar você.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
        <Link to="/plans">
          <button
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#2563eb",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Ver Planos 💳
          </button>
        </Link>

        <Link to="/agents">
          <button
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              background: "#10b981",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Explorar Agentes 🤖
          </button>
        </Link>
      </div>
    </main>
  );
}
