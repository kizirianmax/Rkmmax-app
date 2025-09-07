// src/pages/Agents.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function mask(str = "", keep = 6) {
  if (!str) return "Ø";
  if (str.length <= keep) return "*".repeat(str.length);
  return str.slice(0, keep) + "…" + "*".repeat(Math.max(0, str.length - keep - 1));
}

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Lê as variáveis do build (Vite)
  const SUPA_URL = import.meta.env.VITE_SUPABASE_URL;
  const SUPA_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);
    setErr("");

    const { data, error } = await supabase
      .from("agents")
      .select("id, name, role, description, avatar_url")
      .order("name", { ascending: true });

    if (error) {
      console.error("Supabase error:", error);
      setErr(`${error.message} (code: ${error.code ?? "n/a"})`);
      setAgents([]);
    } else {
      console.log("Supabase OK:", { count: data?.length });
      setAgents(data || []);
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      {/* Bloco de diagnóstico */}
      <div className="mb-4 rounded-xl p-3" style={{ background: "#123", color: "#9ee" }}>
        <div><b>DEBUG</b></div>
        <div>ENV VITE_SUPABASE_URL: <code>{mask(SUPA_URL)}</code></div>
        <div>ENV VITE_SUPABASE_ANON_KEY: <code>{mask(SUPA_KEY)}</code></div>
        <div>Rows carregadas: <b>{agents.length}</b></div>
        {err ? <div style={{ color: "#ffb" }}>Erro: {err}</div> : null}
      </div>

      {loading && <p style={{ textAlign: "center", marginTop: "2rem" }}>Carregando…</p>}
      {!loading && !agents.length && !err && (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>Nenhum agente encontrado.</p>
      )}

      {!loading && agents.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {agents.map((a) => (
            <div key={a.id} className="rounded-2xl shadow-md bg-[#0b1e36] p-4">
              <div className="text-lg font-semibold mb-1">{a.name}</div>
              {a.avatar_url && (
                <img
                  src={a.avatar_url}
                  alt={a.name}
                  className="w-16 h-16 rounded-full mb-2"
                />
              )}
              <div><b>Função:</b> {a.role || "-"}</div>
              <div className="text-sm mt-2 opacity-90">{a.description}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
