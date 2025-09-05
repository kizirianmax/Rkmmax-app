// src/pages/Subscribe.jsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";

export default function Subscribe() {
  const [params] = useSearchParams();
  const isSuccess = params.get("success") === "1";
  const isCanceled = params.get("canceled") === "1";

  let title = "Status da assinatura";
  let message =
    "Não foi possível determinar o status do checkout. Se precisar, tente novamente.";
  let tone = "neutral";

  if (isSuccess) {
    title = "🎉 Assinatura confirmada!";
    message =
      "Pagamento concluído com sucesso. Seu acesso premium será liberado em instantes.";
    tone = "success";
  } else if (isCanceled) {
    title = "⚠️ Pagamento cancelado";
    message =
      "Você cancelou o checkout. Nada foi cobrado. Se quiser, pode tentar novamente.";
    tone = "danger";
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 640, margin: "0 auto" }}>
        <h1
          style={{
            marginBottom: 8,
            color:
              tone === "success"
                ? "#22c55e"
                : tone === "danger"
                ? "#ef4444"
                : "inherit",
          }}
        >
          {title}
        </h1>

        <p style={{ marginBottom: 24 }}>{message}</p>

        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
          {isSuccess ? (
            <>
              <Link className="btn btn-primary" to="/home">
                Ir para a Home
              </Link>
              <Link className="btn btn-secondary" to="/agents">
                Explorar recursos
              </Link>
            </>
          ) : (
            <>
              <Link className="btn btn-primary" to="/plans">
                Ver planos novamente
              </Link>
              <Link className="btn" to="/home">
                Voltar para a Home
              </Link>
            </>
          )}
        </div>

        {!isSuccess && !isCanceled && (
          <p style={{ marginTop: 20, fontSize: 14, opacity: 0.8 }}>
            Dica: confirme se o link do Stripe redireciona para
            <code> /subscribe?success=1 </code> ou <code>/subscribe?canceled=1</code>.
          </p>
        )}
      </div>
    </div>
  );
}
