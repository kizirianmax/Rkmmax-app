import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { pickModel } from "../lib/modelPicker";
import { needsFullModel } from "../lib/complexity";
import { supabase } from "../lib/supabaseClient";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    try {
      setLoading(true);

      const { data, error } = await supabase.from("agents").select("*");

      if (error) throw error;
      if (data) setAgents(data);
    } catch (err) {
      console.error("Erro ao carregar agentes:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h2>Agentes</h2>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <ul>
          {agents.map((agent) => (
            <li key={agent.id}>
              <Link to={`/agents/${agent.id}`}>
                {agent.name} – Modelo: {pickModel(agent.complexity)}
                {needsFullModel(agent.complexity) && " (Full)"}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
