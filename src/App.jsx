import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Agents from "./pages/Agents.jsx";
import AgentDetail from "./pages/AgentDetail.jsx";
import Auth from "./pages/Auth.jsx"; // ⬅️ importar a tela de login

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* página inicial: lista de agentes */}
        <Route path="/" element={<Agents />} />

        {/* detalhe do agente */}
        <Route path="/agent/:id" element={<AgentDetail />} />

        {/* rota alternativa */}
        <Route path="/agents" element={<Agents />} />

        {/* tela de login/cadastro */}
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </BrowserRouter>
  );
}
