// netlify/functions/cors.js
const ALLOWED_ORIGIN = process.env.ORIGIN; // opcional (defina em .env.local / Netlify)

exports.handler = async (event) => {
  const origin = ALLOWED_ORIGIN || event.headers.origin || "*";

  const headers = {
    "Access-Control-Allow-Origin": origin,
    "Vary": "Origin",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-api-token",
  };

  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }

  // Resposta padrão (para teste)
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
