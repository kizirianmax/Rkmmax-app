import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home.jsx";
import Agents from "./pages/Agents.jsx";
import AgentDetail from "./pages/AgentDetail.jsx";
import Auth from "./pages/Auth.jsx";      // tela antiga (pública)
import Login from "./pages/Login.jsx";    // tela nova (pública)

import { AuthProvider } from "./auth/AuthProvider.jsx";
import AuthGate from "./auth/AuthGate.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/login" element={<Login />} />

          {/* ROTAS PROTEGIDAS (passam pelo AuthGate) */}
          <Route
            path="/"
            element={
              <AuthGate>
                <Home />
              </AuthGate>
            }
          />
          <Route
            path="/agents"
            element={
              <AuthGate>
                <Agents />
              </AuthGate>
            }
          />
          <Route
            path="/agent/:id"
            element={
              <AuthGate>
                <AgentDetail />
              </AuthGate>
            }
          />

          {/* fallback: qualquer rota desconhecida vai para Home protegida */}
          <Route
            path="*"
            element={
              <AuthGate>
                <Home />
              </AuthGate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
