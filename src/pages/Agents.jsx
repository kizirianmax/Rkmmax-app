// src/pages/Agents.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./../App.css"; // garante que o estilo do Serginho está ativo

// Lista dos 12 agentes normais
const AGENTS = [
  { name: "Emo", desc: "Mentor emocional — apoio e motivação 🧠" },
  { name: "Didak", desc: "Instrutor — explica e ensina 📚" },
  { name: "Finna", desc: "Inteligência financeira 💸" },
  { name: "Care", desc: "Saúde e bem-estar 💊" },
  { name: "Criar", desc: "Criatividade, escrita e ideias ✍️" },
  { name: "Code", desc: "Programação e depuração 💻" },
  { name: "Talky", desc: "Comunicação e persuasão 🎤" },
  { name: "Focus", desc: "Produtividade e metas 🎯" },
  { name: "Bizu", desc: "Resumos e provas ⚡" },
  { name: "Legalis", desc: "IA jurídica (leis e contratos) ⚖️" },
  { name: "Planx", desc: "Planejamento de vida e carreira 💍" },
  { name: "Orac", desc: "Visão estratégica e decisões 🛰️" },
];

export default function Agents() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Agentes</h1>

      {/* Grid dos 12 agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent) => (
          <div
            key={agent.name}
            className="p-4 bg-white rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-xl font-semibold mb-2">{agent.name}</h2>
            <p className="text-gray-600 mb-4">{agent.desc}</p>
            <div className="flex gap-2">
              <Link
                to={`/agent/${agent.name.toLowerCase()}`}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Abrir
              </Link>
              <Link
                to="/plans"
                className="px-3 py-1 border rounded hover:bg-gray-100"
              >
                Ver planos
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Serginho em destaque */}
      <div className="mt-8">
        <div className="p-6 bg-white rounded-2xl shadow-lg card-serginho relative">
          {/* Badge de destaque */}
          <div className="badge mb-3">⭐ Agente Principal</div>
          <h2 className="text-2xl font-bold mb-2">Serginho</h2>
          <p className="text-gray-700 mb-4 serginho-subtle">
            Agente especial/generalista, gênio. Orquestra os 12 agentes com base
            em fontes confiáveis.
          </p>
          <div className="flex gap-2">
            <Link
              to="/agent/serginho"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Abrir
            </Link>
            <Link
              to="/plans"
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Ver planos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
