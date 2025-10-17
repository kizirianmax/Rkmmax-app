// src/pages/StudyLab.jsx
import React from "react";

export default function StudyLab() {
  return (
    <main style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
        Study Lab
      </h1>
      <p style={{ color: "#64748b", marginBottom: 24 }}>
        Estudo acelerado com <strong>ABNT/APA</strong>, cronogramas e{" "}
        <strong>fontes verificadas (Source-Proof)</strong>.
      </p>
      <p style={{ color: "#64748b", marginBottom: 16 }}>
        O Study Lab é uma funcionalidade <strong>opcional</strong> para quem
        precisa de suporte educacional avançado.
      </p>
      <p style={{ color: "#64748b" }}>
        Em breve: trilhas de estudo personalizadas.
      </p>
    </main>
  );
}

