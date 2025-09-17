// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import "./styles.css";

// ----- páginas mínimas (placers) -----
function Home() {
  return (
    <>
      <h1 className="title-hero">Bem-vindo ao RKMMAX 🚀</h1>
      <p className="page-sub">Escolha sua opção e explore os agentes de IA.</p>
    </>
  );
}
function Agents() {
  return <h1 className="title-hero">Lista de Agentes</h1>;
}
function Info() {
  return <h1 className="title-hero">Informações</h1>;
}
function Plans() {
  return <h1 className="title-hero">Planos</h1>;
}
function Login() {
  return <h1 className="title-hero">Entrar</h1>;
}
function Signup() {
  return <h1 className="title-hero">Criar conta</h1>;
}
// -------------------------------------

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
