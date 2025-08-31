// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";

import { AuthProvider } from "./auth/AuthProvider";
import AuthGate from "./auth/AuthGate";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rota pública */}
          <Route path="/login" element={<Login />} />

          {/* Rotas privadas */}
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
