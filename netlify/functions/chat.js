 // netlify/functions/chat.js
// Função Serverless no Netlify para conversar com a API da OpenAI

const OpenAI = require("openai");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // troque por seu domínio se quiser restringir
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

exports.handler = async (event) => {
  // Preflight CORS
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "OK" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "OPENAI_API_KEY não configurada nas variáveis do Netlify",
      }),
    };
  }

  let payload = {};
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "JSON inválido no corpo da requisição" }),
    };
  }

  // Aceita { messages: [...] } ou { prompt: "texto" }
  const messages =
    payload.messages ||
    (payload.prompt ? [{ role: "user", content: payload.prompt }] : null);

  if (!messages || !Array.isArray(messages)) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Envie 'messages' como array ou 'prompt' como string",
      }),
    };
  }

  const client = new OpenAI({ apiKey });

  try {
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
    });

    const reply = completion?.choices?.[0]?.message?.content ?? "";

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: "Falha ao chamar OpenAI",
        details: err?.message || String(err),
      }),
    };
  }
};
