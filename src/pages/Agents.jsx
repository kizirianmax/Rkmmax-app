import React, { useEffect, useState } from "react";
// se você já tem um supabaseClient no projeto, use ele:
import { supabase } from "../supabaseClient"; 
// Se não tiver, use isto no lugar da linha acima:
// import { createClient } from "@supabase/supabase-js";
// const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      const { data, error } = await supabase
        .from("agents")
        .select("id, name, description")
        .order("id", { ascending: true });

      if (error) {
        console.error("Erro ao carregar agentes:", error.message);
        setAgents([]); // evita travar a tela
      } else {
        setAgents(data || []);
      }
      setLoading(false);
    }
    loadAgents();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Carregando agentes...</p>;
  if (!agents.length) return <p style={{ textAlign: "center" }}>Nenhum agente encontrado.</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ textAlign: "center", color: "#00bfff" }}>Agentes</h1>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {agents.map((a) => (
          <li key={a.id} style={{ marginBottom: 15, padding: 15, background: "#111827", borderRadius: 10, color: "#f9fafb" }}>
            <h2 style={{ margin: 0 }}>{a.name}</h2>
            <p style={{ margin: "6px 0 0" }}>{a.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
