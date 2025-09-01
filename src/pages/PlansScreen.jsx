// src/pages/PlansScreen.jsx
import React from "react";
import { Link } from "react-router-dom";

const PLANS = [
  {
    id: "simple",
    name: "Simples",
    price: "R$14.9",
    bullets: [
      "30 perguntas/dia",
      "Sem imagens",
      "12 agentes + Serginho (básico)",
    ],
  },
  {
    id: "medium",
    name: "Médio",
    price: "R$24.9",
    bullets: [
      "100 perguntas/dia",
      "Até 30 imagens/mês",
      "Agentes mais inteligentes",
    ],
  },
  {
    id: "top",
    name: "Top",
    price: "R$34.99",
    bullets: [
      "Uso justo (quase ilimitado)",
      "Até 100 imagens/mês",
      "Suporte prioritário",
    ],
  },
];

export default function PlansScreen() {
  return (
    <div className="container">
      <h1 className="mb-1">Planos RKMMax 🚀</h1>
      <p className="mb-3">Região detectada: <strong>Brasil</strong></p>

      <div className="row">
        {PLANS.map((p) => (
          <div className="col" key={p.id}>
            <div className="card">
              <h2 className="mb-1">
                {p.name} — {p.price}
              </h2>
              <ul className="mb-3">
                {p.bullets.map((b, i) => (
                  <li key={i} style={{ marginBottom: 6 }}>{b}</li>
                ))}
              </ul>

              {/* Botão AGORA CLICÁVEL */}
              <Link className="btn" to={`/subscribe/${p.id}`}>
                Assinar
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
