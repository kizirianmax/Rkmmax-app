// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AgentsPage from "./pages/Agents";
import Pricing from "./pages/Pricing"; // <- este arquivo PRECISA existir

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<AgentsPage />} />
        <Route path="/pricing" element={<Pricing />} />
        {/* fallback para qualquer rota desconhecida */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
