import React from "react";
import usePlan from "../hooks/usePlan";
import { Link } from "react-router-dom";

export default function PlanGate({ requirePlan = "premium", children }) {
  const { plan, loading } = usePlan();
  if (loading) return <p style={{ padding: 16 }}>Verificando seu plano…</p>;

  const ok = requirePlan === "premium" ? plan === "premium" : true;
  if (ok) return children;

  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Recurso Premium</h2>
      <p style={{ color: "#475569", marginBottom: 16 }}>
        Este conteúdo está disponível para assinantes do plano <strong>Premium</strong>.
      </p>
      <Link
        to="/pricing"
        style={{
          display: "inline-block",
          padding: "10px 16px",
          background: "#06b6d4",
          color: "#000",
          borderRadius: 12,
          fontWeight: 700,
          textDecoration: "none"
        }}
      >
        Ver planos
      </Link>
    </div>
  );
}
