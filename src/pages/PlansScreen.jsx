import React from "react";

const PlansScreen = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-4">
      <h1 className="text-3xl font-bold mb-6">Planos RKMMAX</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {/* Plano Básico */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">🇧🇷 Brasil (BRL)</h2>
          <h3 className="text-lg text-blue-400 mb-4">Básico</h3>
          <p className="mb-4">Acesso inicial ao RKMMAX</p>
          <p className="text-2xl font-bold mb-6">R$ 14,90/mês</p>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg"
            onClick={() => iniciarCheckout("price_brasil_basico")}
          >
            Assinar
          </button>
        </div>

        {/* Plano Premium */}
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg text-center">
          <h2 className="text-xl font-semibold mb-2">🇧🇷 Brasil (BRL)</h2>
          <h3 className="text-lg text-green-400 mb-4">Premium</h3>
          <p className="mb-4">Tudo incluso, máxima performance</p>
          <p className="text-2xl font-bold mb-6">R$ 39,90/mês</p>
          <button
            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg"
            onClick={() => iniciarCheckout("price_brasil_premium")}
          >
            Assinar
          </button>
        </div>
      </div>
    </div>
  );
};

// ⚡ Função para chamar a função do Netlify
async function iniciarCheckout(priceKey) {
  try {
    const response = await fetch(
      "/.netlify/functions/create-checkout-session",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceKey }),
      }
    );

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Erro ao iniciar checkout");
      console.error(data);
    }
  } catch (err) {
    console.error(err);
    alert("Erro de conexão com o servidor.");
  }
}

// ✅ Correção final
export default PlansScreen;
