import { Link } from "react-router-dom";
import agents from "../data/agents";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Agentes</h1>

      <div className="space-y-3">
        {agents.map((a) => (
          <Link
            key={a.id}
            to={`/agent/${a.id}`}
            className="block rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition p-4"
          >
            <div className="text-lg font-semibold">{a.name}</div>
            <div className="text-sm text-white/70">{a.role}</div>
          </Link>
        ))}
      </div>
    </main>
  );
}
