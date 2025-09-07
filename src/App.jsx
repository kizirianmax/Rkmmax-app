import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import PlansScreen from "./pages/PlansScreen"; // ✅ Correto agora
import Subscribe from "./pages/Subscribe";
import ResetPassword from "./pages/ResetPassword";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Agents />} />
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/plans" element={<PlansScreen />} /> {/* ✅ funciona */}
        <Route path="/subscribe" element={<Subscribe />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
