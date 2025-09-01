// src/pages/Agents.jsx
import React from "react";
import { Link } from "react-router-dom";

const AGENTS = [
  { id: "emo",    name: "Emo",    desc: "Mentor emocional (apoio e motivação) 🫶" },
  { id: "didak",  name: "Didak",  desc: "Instrutor – explica e ensina 📚" },
  { id: "finna",  name: "Finna",  desc: "Inteligência financeira 💸" },
  { id: "care",   name: "Care",   desc: "Saúde e bem-estar 💊" },
  { id: "criar",  name: "Criar",  desc: "Criatividade, escrita e ideias ✍️" },
  { id: "code",   name: "Code",   desc: "Programação e depuração 💻" },
  { id: "talky",  name: "Talky",  desc: "Comunicação e persuasão 🗣️" },
  { id: "focus",  name: "Focus",  desc: "Produtividade e metas 🎯" },
  { id: "bizu",   name: "Bizu",   desc: "Resumos e provas ⚡" },
  { id: "legalis",name: "Legalis",desc: "IA jurídica (leis e contratos) ⚖️" },
  { id: "planx",  name: "Planx",  desc: "Planejamento de vida e carreira 🧭" },
  { id: "orac",   name: "Orac",   desc: "Visão estratégica e decisões 🔭" },
];

export default function Agents() {
  return (
    <div className="container">
      <h1 className="mb-3">Agentes</h1>

      <div className="row">
        {AGENTS.map((a) => (
          <div className="col" key={a.id}>
            <div className="card">
              <h3 className="mb-1">{a.name}</h3>
              <p className="mb-3">{a.desc}</p>

              <div className="row gap-2">
                <Link className="btn" to={`/agents/${a.id}`}>Abrir</Link>
                <Link className="btn btn-outline" to="/plans">Ver planos</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
