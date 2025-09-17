// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles.css";

// Páginas (ajuste os paths conforme seus arquivos)
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Info from "./pages/Info";
import Plans from "./pages/Plans";
import Login from "./auth/Login";
import Signup from "./auth/Signup";

// Layout com Navbar fixa no topo e container do conteúdo
function Layout() {
  return (
    <>
      <Navbar />
      <main className="app-main" style={{ padding: "24px 16px 56px" }}>
        <Outlet />
      </main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/agentes" element={<Agents />} />
          <Route path="/info" element={<Info />} />
          <Route path="/planos" element={<Plans />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
