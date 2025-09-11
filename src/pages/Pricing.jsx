// src/pages/Pricing.jsx
import React from "react";
import PricingTable from "../components/PricingTable.jsx";

export default function Pricing() {
  return (
    <div>
      <h1 style={{ textAlign: "center", margin: "20px 0" }}>Planos RKMMax</h1>
      <PricingTable />
    </div>
  );
}
