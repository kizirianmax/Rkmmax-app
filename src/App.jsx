import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./ErrorBoundary";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Home from "./pages/Home";
import Account from "./pages/Account";
import Agents from "./pages/Agents";
import AgentDetail from "./pages/AgentDetail";
import PlansScreen from "./pages/PlansScreen";
import Subscribe from "./pages/Subscribe";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./pages/Logout"; // ✅ Importamos o Logout

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/account" element={<Account />} />
          <Route path="/agents" element={<Agents />} />
          <Route path="/agents/:id" element={<AgentDetail />} />
          <Route path="/plans" element={<PlansScreen />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/logout" element={<Logout />} /> {/* ✅ Nova rota */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
