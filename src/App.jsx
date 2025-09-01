// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import PlansScreen from "./pages/PlansScreen";

import { AuthProvider } from "./auth/AuthProvider";
import AuthGate from "./auth/AuthGate";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
            path="/agents/:id"
            element={
              <AuthGate>
                <AgentDetail />
              </AuthGate>
            }
          />
          <Route
            path="/plans"
            element={
              <AuthGate>
                <PlansScreen />
              </AuthGate>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
