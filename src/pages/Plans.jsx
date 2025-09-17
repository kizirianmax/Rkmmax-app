import React from "react";
import PricingTable from "../components/PricingTable";

export default function Plans() {
  return (
    <>
      <h1 className="title-hero">Planos</h1>
      <p className="page-sub">
        Assinatura segura via Stripe. Escolha o melhor para você.
      </p>
      <PricingTable />
    </>
  );
}
