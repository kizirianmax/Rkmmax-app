// src/pages/AgentDetail.jsx
import React from "react";
import { useParams, Link } from "react-router-dom";

const BASE_AGENTS = {
  emo:     { title: "Emo",     desc: "Mentor emocional — apoio e motivação." },
  didak:   { title: "Didak",   desc: "Instrutor — explica e ensina." },
  finna:   { title: "Finna",   desc: "Inteligência financeira." },
  care:    { title: "Care",    desc: "Saúde e bem-estar." },
  criar:   { title: "Criar",   desc: "Criatividade, escrita e ideias." },
  code:    { title: "Code",    desc: "Programação e depuração." },
  talky:   { title: "Talky",   desc: "Comunicação e persuasão." },
  focus:   { title: "Focus",   desc: "Produtividade e metas." },
  bizu:    { title: "Bizu",    desc: "Resumos e provas." },
  legalis: { title: "Legalis", desc: "IA jurídica (leis e contratos)." },
  planx:   { title: "Planx",   desc: "Planejamento de vida e carreira." },
  orac:    { title: "Orac",    desc: "Visão estratégica e decisões." },
};

// Config especial do Serginho
const SERGINHO = {
  id: "serginho",
  title: "Serginho — Agente Principal",
  tagline: "Agente especial/generalista, gênio. Orquestra os 12 agentes com base em fontes confiáveis.",
  evolution: [
    "Aprende com suas interações: observa padrões do que funciona pra você.",
    "Decide quando resolver sozinho ou acionar um dos 12 especialistas.",
    "Sintetiza as respostas dos agentes e entrega uma solução única.",
    "Evolui com o plano: quanto mais alto o plano, mais recursos e inteligência ele usa."
  ],
  principles: [
    "Compromisso com a verdade (evita inventar; explica incertezas).",
    "Transparência: diz quando consultou outros agentes.",
    "Eficiência: divide em subtarefas quando necessário e integra o resultado.",
  ],
  ctaText: "Começar com o Serginho",
};

export default function AgentDetail() {
  const { id } = useParams();
  const isSerginho = id === "serginho";

  if (isSerginho) {
    return (
      <div className="container">
        <div className="card">
          <h1 className="mb-1">{SERGINHO.title} ⭐</h1>
          <p className="mb-3">{SERGINHO.tagline}</p>

          <div className="section">
            <h2 className="mb-2">Como o Serginho evolui</h2>
            <ul className="mb-3">
              {SERGINHO.evolution.map((item, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="section">
            <h2 className="mb-2">Princípios</h2>
            <ul className="mb-3">
              {SERGINHO.principles.map((p, i) => (
                <li key={i} style={{ marginBottom: "8px" }}>{p}</li>
              ))}
            </ul>
          </div>

          <div className="row gap-2">
            <Link className="btn" to="/plans">{SERGINHO.ctaText}</Link>
            <Link className="btn btn-outline" to="/agents">Voltar</Link>
          </div>
        </div>
      </div>
    );
  }

  // Detalhe genérico para os demais agentes
  const agent = BASE_AGENTS[id];
  const title = agent ? agent.title : "Agente";
  const desc  = agent ? agent.desc  : "Agente do RKMMax.";

  return (
    <div className="container">
      <div className="card">
        <h1 className="mb-1">{title}</h1>
        <p className="mb-3">{desc}</p>

        <div className="section">
          <h2 className="mb-2">Como este agente ajuda</h2>
          <p className="mb-3">
            Este agente é especializado no seu domínio. Ele pode trabalhar em conjunto com o
            Serginho quando necessário para entregar resultados mais completos.
          </p>
        </div>

        <div className="row gap-2">
          <Link className="btn" to="/plans">Usar este agente</Link>
          <Link className="btn btn-outline" to="/agents">Voltar</Link>
        </div>
      </div>
    </div>
  );
}
