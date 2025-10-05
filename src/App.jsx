// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import BrandTitle from "./components/BrandTitle";

import Home from "./pages/Home";
import AgentsPage from "./pages/Agents";
import Pricing from "./pages/Pricing";

export default function App() {
  return (
    <BrowserRouter>
      {/* Define o título da aba com base na marca */}
      <BrandTitle />

      {/* Navegação */}
      <Header />

      {/* Rotas */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/agents" element={<AgentsPage />} />
        {/* Rota antiga mantida */}
        <Route path="/pricing" element={<Pricing />} />
        {/* Alias: permite usar /plans também */}
        <Route path="/plans" element={<Pricing />} />
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
