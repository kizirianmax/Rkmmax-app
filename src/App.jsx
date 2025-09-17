// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles.css";

// Páginas
import Home from "./pages/Home";
import Agents from "./pages/Agents";
import Info from "./pages/Info";
import Plans from "./pages/Plans";

// Autenticação
import Login from "./auth/Login";
import Signup from "./auth/Signup";

// Layout com Navbar fixa
function Layout() {
  return (
    <>
      <Navbar />
      <main className="app-main" style={{ padding: "20px" }}>
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
