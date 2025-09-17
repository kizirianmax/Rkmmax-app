import React from "react";
import Navbar from "./components/Navbar"; 
import "./styles.css";

export default function App() {
  return (
    <>
      {/* Navbar no topo */}
      <Navbar />

      {/* Conteúdo principal do app */}
      <main className="app-main">
        <h1>Bem-vindo ao RKMMAX 🚀</h1>
        <p>Escolha sua opção e explore os agentes de IA.</p>
      </main>
    </>
  );
}
