// src/pages/Agents.jsx
import React from "react";
import { Link } from "react-router-dom";

const MOCK_AGENTS = [
  { id: "mock-1", name: "Serginho", role: "Atendente",
    description: "Atendimento rápido e cordial. Especialista em primeiros contatos.",
    avatar_url: "https://i.pravatar.cc/150?img=13" },
  { id: "emo", name: "Emo", role: "Mentor emocional",
    description: "Apoio psicológico, motivação e inteligência emocional.",
    avatar_url: "https://i.pravatar.cc/150?img=1" },
  { id: "didak", name: "Didak", role: "Instrutor",
    description: "Explica conceitos, ensina conteúdos e facilita o aprendizado.",
    avatar_url: "https://i.pravatar.cc/150?img=2" },
  { id: "finna", name: "Finna", role: "Inteligência financeira",
    description: "Ajuda no controle de gastos e planejamento financeiro.",
    avatar_url: "https://i.pravatar.cc/150?img=3" },
  { id: "care", name: "Care", role: "Saúde e bem-estar",
    description: "Oferece dicas de autocuidado e saúde diária.",
    avatar_url: "https://i.pravatar.cc/150?img=4" },
  { id: "criar", name: "Criar", role: "Criatividade",
    description: "Inspira ideias criativas em escrita, arte e inovação.",
    avatar_url: "https://i.pravatar.cc/150?img=5" },
  { id: "code", name: "Code", role: "Programador",
    description: "Auxilia em código, lógica e depuração de sistemas.",
    avatar_url: "https://i.pravatar.cc/150?img=6" },
  { id: "talky", name: "Talky", role: "Comunicação",
    description: "Aprimora textos, discursos e interações sociais.",
    avatar_url: "https://i.pravatar.cc/150?img=7" },
  { id: "focus", name: "Focus", role: "Produtividade",
    description: "Ajuda a organizar, focar e atingir metas.",
    avatar_url: "https://i.pravatar.cc/150?img=8" },
  { id: "bizu", name: "Bizu", role: "Resumos e provas",
    description: "Faz resumos rápidos e ajuda em revisões de estudo.",
    avatar_url: "https://i.pravatar.cc/150?img=9" },
  { id: "legalis", name: "Legalis", role: "IA jurídica",
    description: "Explica leis, contratos e direitos de forma clara.",
    avatar_url: "https://i.pravatar.cc/150?img=10" },
  { id: "planx", name: "Planx", role: "Planejamento de vida e carreira",
    description: "Orienta em decisões profissionais e pessoais.",
    avatar_url: "https://i.pravatar.cc/150?img=11" },
  { id: "orac", name: "Orac", role: "Visão estratégica",
    description: "Auxilia em decisões complexas e visão de futuro.",
    avatar_url: "https://i.pravatar.cc/150?img=12" },
];

export default function Agents() {
  return (
    <div style={{ padding: "1.5rem", color: "#e6eef5" }}>
      <h1 style={{ marginBottom: "1rem", color: "#2ee9e9" }}>
        Lista de Agentes (mock)
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {MOCK_AGENTS.map((a) => (
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
                  <div style={{ fontWeight: 700 }}>{a.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{a.role}</div>
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 14, lineHeight: 1.4 }}>
                {a.description}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
