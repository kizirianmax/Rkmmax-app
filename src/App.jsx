// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import PlansScreen from "./pages/PlansScreen";
import ResetPassword from "./pages/ResetPassword";
import Subscribe from "./pages/Subscribe";
import Auth from "./pages/Auth";
import ErrorBoundary from "./ErrorBoundary";

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
          <Route path="/plans" element={<PlansScreen />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
