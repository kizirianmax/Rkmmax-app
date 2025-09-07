import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

function Agents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    async function fetchAgents() {
      const { data, error } = await supabase.from("agents").select("*");
      if (error) {
        console.error("Erro ao buscar agentes:", error.message);
      } else {
        setAgents(data);
      }
    }

    fetchAgents();
  }, []);

  return (
    <div>
      <h1>Lista de Agentes</h1>
      <ul>
        {agents.map((agent) => (
          <li key={agent.id}>{agent.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Agents;
