import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import pickModel from "../lib/modelPicker";
import { needsFullModel } from "../lib/complexity";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgents() {
      try {
        const { data, error } = await supabase.from("agents").select("*");

        if (error) {
          console.error("Erro ao buscar agentes:", error.message);
        } else {
          setAgents(data || []);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  if (loading) {
    return <p>Carregando agentes...</p>;
  }

  return (
    <div>
      <h1>Agentes</h1>
      {agents.length === 0 ? (
        <p>Nenhum agente encontrado.</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <Link to={`/agent/${agent.id}`}>
                {agent.name} – Modelo:{" "}
                {pickModel(agent, needsFullModel(agent) ? "full" : "simple")}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
