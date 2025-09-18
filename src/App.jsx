// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import PricingTable from "./components/PricingTable";
import AgentsList from "./components/AgentsList"; // ✅ Importamos a lista de agentes

function App() {
  return (
    <div>
      {/* Barra de navegação */}
      <Navbar />

      {/* Seção de agentes */}
      <main>
        <AgentsList />
      </main>

      {/* Seção de planos */}
      <section style={{ marginTop: "3rem" }}>
        <PricingTable />
      </section>
    </div>
  );
}

export default App;
