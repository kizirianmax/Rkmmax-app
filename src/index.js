// src/index.js (PROVISÓRIO – diagnóstico)
import React from "react";
import { createRoot } from "react-dom/client";

// Componente mínimo de prova
function RootProbe() {
  return (
    <div style={{ padding: 24, background: "white", color: "black" }}>
      <h1>Probe OK</h1>
      <p>Se você está vendo isso, o React está renderizando.</p>
    </div>
  );
}

const container = document.getElementById("root");

// Se o #root não existir, mostre mensagem clara na página
if (!container) {
  const pre = document.createElement("pre");
  pre.textContent = "ERRO: div#root não encontrado no public/index.html";
  pre.style.padding = "16px";
  pre.style.background = "white";
  pre.style.color = "red";
  document.body.appendChild(pre);
} else {
  createRoot(container).render(<RootProbe />);
}

// Listeners para mostrar erros de runtime direto na página (prod)
window.addEventListener("error", (e) => {
  const pre = document.createElement("pre");
  pre.textContent = "JS error: " + e.message;
  pre.style.padding = "16px";
  pre.style.background = "white";
  pre.style.color = "crimson";
  document.body.appendChild(pre);
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = e?.reason?.message || String(e.reason);
  const pre = document.createElement("pre");
  pre.textContent = "Promise rejection: " + msg;
  pre.style.padding = "16px";
  pre.style.background = "white";
  pre.style.color = "crimson";
  document.body.appendChild(pre);
});
