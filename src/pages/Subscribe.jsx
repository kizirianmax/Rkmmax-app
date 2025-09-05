// src/pages/Subscribe.jsx
import React, { useMemo } from "react";
import { Link, useLocation } from "react-router-dom";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function Subscribe() {
  const q = useQuery();
  const success = q.get("success");
  const canceled = q.get("canceled");

  return (
    <div className="container">
      {success && (
        <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1>✅ Assinatura criada!</h1>
          <p>
            O pagamento foi confirmado e sua assinatura está ativa.
            Você já pode aproveitar todos os recursos do RKMMAX.
          </p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link className="btn" to="/">Ir para a Home</Link>
            <Link className="btn outline" to="/agents">Explorar recursos</Link>
          </div>
        </div>
      )}

      {canceled && (
        <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1>❌ Pagamento cancelado</h1>
          <p>Nenhuma cobrança foi realizada. Você pode tentar novamente quando quiser.</p>
          <div style={{ display: "flex", gap: 12 }}>
            <Link className="btn" to="/plans">Voltar aos planos</Link>
            <Link className="btn outline" to="/">Ir para a Home</Link>
          </div>
        </div>
      )}

      {!success && !canceled && (
        <div className="card" style={{ maxWidth: 560, margin: "0 auto" }}>
          <h1>🔁 Processando…</h1>
          <p>Estamos verificando o status do checkout.</p>
          <Link className="btn outline" to="/">Voltar</Link>
        </div>
      )}
    </div>
  );
}
