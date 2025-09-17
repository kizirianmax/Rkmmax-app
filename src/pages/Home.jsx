import React from "react";

export default function Home() {
  return (
    <>
      <h1 className="title-hero">Bem-vindo ao RKMMAX 🚀</h1>
      <p className="page-sub">
        Escolha sua opção e comece a usar nossa IA com assinatura segura via Stripe.
      </p>

      <div className="agents-grid" style={{ marginTop: 16 }}>
        <section className="agent-card">
          <div className="agent-top">
            <img className="agent-avatar" src="/avatars/serginho.png" alt="Serginho" />
            <div>
              <h3 className="agent-name">Serginho</h3>
              <p className="agent-role">Orquestrador</p>
            </div>
          </div>
          <p className="agent-desc">
            Agente especial e generalista. Coordena os 12 especialistas, supervisiona e articula todas as interações.
          </p>
          <a href="/agentes" className="btn-chat" style={{ display:"inline-block", textAlign:"center" }}>
            Ver todos os agentes
          </a>
        </section>

        <section className="agent-card">
          <div className="agent-top">
            <img className="agent-avatar" src="/avatars/emo.png" alt="Emo" />
            <div>
              <h3 className="agent-name">Planos</h3>
              <p className="agent-role">Assine com segurança</p>
            </div>
          </div>
          <p className="agent-desc">
            Planos claros, pagamento via Stripe e acesso imediato no app.
          </p>
          <a href="/planos" className="btn-chat" style={{ display:"inline-block", textAlign:"center" }}>
            Ver planos
          </a>
        </section>
      </div>
    </>
  );
}
