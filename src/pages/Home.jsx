// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import agents from "../data/agents";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Bem-vindo ao RKMMAX 🚀</h1>
      <p className="text-gray-600 mb-6">
        Escolha um dos 12 agentes abaixo para conversar.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {agents.map((a) => (
          <Link
            key={a.id}
            to={`/agents/${a.id}`}
            className="block rounded-xl border border-gray-300 p-4 hover:bg-gray-50"
          >
            <strong className="text-lg">{a.name}</strong>
            <div className="text-sm text-gray-600">{a.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
