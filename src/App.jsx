import { BrowserRouter, Routes, Route } from "react-router-dom";
import Agents from "./pages/Agents.jsx";
import AgentDetail from "./pages/AgentDetail.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* página inicial: lista de agentes */}
        <Route path="/" element={<Agents />} />

        {/* detalhe do agente */}
        <Route path="/agent/:id" element={<AgentDetail />} />

        {/* rota alternativa para /agents (opcional) */}
        <Route path="/agents" element={<Agents />} />
      </Routes>
    </BrowserRouter>
  );
}
