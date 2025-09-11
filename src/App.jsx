// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import PlansScreen from "./pages/PlansScreen";
import Subscribe from "./pages/Subscribe";
import ResetPassword from "./pages/ResetPassword";
import Pricing from "./pages/Pricing";   // ⬅️ nova importação

function App() {
  return (
    <Router>
      <Routes>
        {/* Página inicial redireciona para a lista de agentes */}
        <Route path="/" element={<Agents />} />
        <Route path="/agents" element={<Agents />} />

        {/* Detalhe do agente */}
        <Route path="/agent/:id" element={<AgentDetail />} />

        {/* Outras páginas */}
        <Route path="/plans" element={<PlansScreen />} />
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Nova página de preços */}
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </Router>
  );
}

export default App;
