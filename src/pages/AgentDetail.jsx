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
        <h1 className="text-2xl font-bold text-red-600">Agente não encontrado ❌</h1>
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

      <Link
        to="/"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
      >
        ← Voltar
      </Link>
    </main>
  );
}
