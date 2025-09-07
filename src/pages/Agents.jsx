// src/pages/Agents.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient"; // mantém o caminho que você já usa
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function Agents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("agents") // tabela agents (tudo minúsculo)
      .select("id, name, role, description, avatar_url")
      .order("name", { ascending: true });

    if (error) {
      console.error("Erro ao carregar agentes:", error.message);
      setAgents([]);
    } else {
      setAgents(data || []);
    }

    setLoading(false);
  };

  if (loading) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Carregando...</p>;
  }

  if (!agents.length) {
    return <p style={{ textAlign: "center", marginTop: "2rem" }}>Nenhum agente encontrado.</p>;
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {agents.map((agent) => (
        <Card key={agent.id} className="rounded-2xl shadow-md">
          <CardHeader>
            <CardTitle>{agent.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {agent.avatar_url && (
              <img
                src={agent.avatar_url}
                alt={agent.name}
                className="w-16 h-16 rounded-full mb-2"
              />
            )}
            <p><strong>Função:</strong> {agent.role || "—"}</p>
            <p className="text-sm mt-2">{agent.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
