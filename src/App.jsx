// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css"; // importa os estilos globais

// Páginas
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import ResetPassword from "./pages/ResetPassword";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import Subscribe from "./pages/Subscribe";
import PlansScreen from "./pages/PlansScreen";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/plans" element={<PlansScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
