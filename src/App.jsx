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
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <AuthGate>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset" element={<ResetPassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/agents" element={<Agents />} />
              <Route path="/agents/:id" element={<AgentDetail />} />
              <Route path="/plans" element={<PlansScreen />} />
            </Routes>
          </AuthGate>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
