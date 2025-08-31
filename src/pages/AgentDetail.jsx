// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";
import agents from "../data/agents";

export default function AgentDetail() {
  const { id } = useParams();
  const agent = agents.find((a) => a.id === id);

  if (!agent) {
    return (
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-red-600">Agente não encontrado</h1>
        <Link to="/" className="text-blue-500 underline mt-4 block">
          Voltar para a Home
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{agent.name}</h1>
      <p className="text-gray-700 text-lg mb-6">{agent.description}</p>

      {/* 🔥 Bloco especial só para o Serginho */}
      {agent.id === "serginho" && (
        <div className="p-4 mb-6 rounded-lg bg-yellow-100 border border-yellow-400">
          <p className="text-yellow-800 font-semibold">
            👋 Oi, eu sou o Serginho, cheguei para somar aqui no RKMMax 😎🚀
          </p>
        </div>
      )}

      <Link to="/" className="text-blue-500 underline">
        Voltar para a Home
      </Link>
    </main>
  );
}
