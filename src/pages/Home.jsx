// src/pages/Home.jsx
import { Link } from "react-router-dom";
import agents from "../data/agents";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Bem-vindo ao RKMMax 🚀
      </h1>
      <p className="text-gray-600 text-center mb-8">
        Escolha um dos 12 agentes abaixo para começar:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {agents.map((a) => (
          <Link
            key={a.id}
            to={`/agent/${a.id}`}
            className="block rounded-xl border p-4 shadow hover:shadow-lg transition"
          >
            <div className="text-lg font-semibold">{a.name}</div>
            <div className="text-sm text-gray-500">{a.description}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
