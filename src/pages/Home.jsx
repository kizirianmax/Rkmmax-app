import React from "react";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">🚀 Bem-vindo ao RKMMAX</h1>
      <p className="text-gray-700 mb-8">
        Use nossa IA com assinatura segura via Stripe. <br />
        Comece pelo <strong>Serginho (grátis)</strong> ou destrave os{" "}
        <strong>12 especialistas</strong> no plano Premium.
      </p>

      {/* Serginho */}
      <div className="bg-white shadow rounded-2xl p-5 mb-6">
        <div className="flex items-center">
          <img
            src="/serginho.svg"
            alt="Serginho"
            className="w-14 h-14 rounded-full object-cover mr-4"
          />
          <div>
            <h2 className="text-xl font-semibold">Serginho</h2>
            <p className="text-sm text-gray-500">Orquestrador</p>
          </div>
          <span className="ml-auto text-green-600 font-medium">Livre</span>
        </div>
        <p className="text-gray-700 mt-3">
          Agente especial e generalista. Orquestra os 12 especialistas,
          supervisiona e articula todas as interações para resolver qualquer
          tarefa.
        </p>
        <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
          Explorar Especialistas (Premium)
        </button>
      </div>

      {/* Especialistas preview */}
      <div className="bg-white shadow rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Especialistas (preview)</h3>
          <a href="/agentes" className="text-blue-600 text-sm font-medium">
            Ver todos os 12
          </a>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
            <img src="/icons/emo.png" alt="Emo" className="w-6 h-6" />
            <span>Emo</span>
            <span className="text-xs bg-gray-300 px-2 py-0.5 rounded">
              Premium
            </span>
          </div>
          <div className="bg-gray-100 rounded-lg px-4 py-2 flex items-center gap-2">
            <img src="/icons/didak.png" alt="Didak" className="w-6 h-6" />
            <span>Didak</span>
            <span className="text-xs bg-gray-300 px-2 py-0.5 rounded">
              Premium
            </span>
          </div>
        </div>
        <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
          Destravar Especialistas (Premium)
        </button>
      </div>

      {/* Planos */}
      <div className="bg-white shadow rounded-2xl p-5">
        <h3 className="text-lg font-semibold mb-2">Planos</h3>
        <p className="text-gray-700 mb-4">
          Planos claros, pagamento via Stripe e acesso imediato no app. <br />
          Suporte e upgrades simples para crescer junto com você.
        </p>
        <button className="w-full bg-gray-900 text-white font-semibold py-2 px-4 rounded-lg shadow">
          Ver planos
        </button>
        <ul className="text-gray-600 text-sm mt-4 list-disc list-inside">
          <li>SSL/TLS automático</li>
          <li>Checkout Stripe</li>
          <li>PWA Android/iOS</li>
          <li>12 Especialistas + Orquestrador</li>
        </ul>
      </div>
    </div>
  );
}
