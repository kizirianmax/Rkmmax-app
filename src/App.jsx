// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Login from "./pages/Login";

import { AuthProvider } from "./auth/AuthProvider";
import AuthGate from "./auth/AuthGate";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* ROTAS PÚBLICAS */}
          <Route path="/login" element={<Login />} />

          {/* ROTAS PROTEGIDAS */}
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
            path="/agents/:id"
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
