import React from "react";
import { Link } from "react-router-dom";
import agents from "../data/agents";

export default function Agents() {
  return (
    <main className="container" style={{ padding: "24px" }}>
      <h1>Agentes</h1>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {agents.map((a) => (
          <li
            key={a.id}
            style={{
              margin: "12px 0",
              padding: "12px",
              border: "1px solid #333",
              borderRadius: 8,
            }}
          >
            <Link
              to={`/agent/${a.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <strong>{a.name}</strong>
              <div style={{ opacity: 0.8 }}>{a.role}</div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
