// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import AgentsPage from "./pages/Agents";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<AgentsPage />} />
        {/* Mantém a rota antiga */}
        <Route path="/pricing" element={<Pricing />} />
        {/* Alias para o botão/links que usam /plans */}
        <Route path="/plans" element={<Pricing />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
