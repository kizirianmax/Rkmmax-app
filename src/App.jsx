// src/App.jsx
import React from "react";
import Navbar from "./components/Navbar";
import AgentsList from "./components/AgentsList";
// import PricingTable from "./components/PricingTable"; // ← TEMP: comente

export default function App() {
  return (
    <div>
      <Navbar />
      <main>
        <AgentsList />
      </main>
      {/* <section style={{ marginTop: "3rem" }}>
        <PricingTable />
      </section> */}
    </div>
  );
}
