import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Auth from "./pages/Auth";
import Login from "./pages/Login";

import { AuthProvider } from "./auth/AuthProvider";
import AuthGate from "./auth/AuthGate";

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
