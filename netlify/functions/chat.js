// /netlify/functions/chat.js

import { guardAndBill } from "./guardAndBill.js";
import pickModel from "../../src/lib/modelPicker.js";
import OpenAI from "openai";

// --- CORS básico (se você já usa ./cors.js, pode remover esta parte e usar seu helper) ---
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

export async function handler(event) {
  // preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: corsHeaders, body: "" };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Use POST" }),
    };
  }

  try {
    const { user, plan, prompt } = JSON.parse(event.body || "{}");

    if (!user?.id || !plan || !prompt) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: "Campos obrigatórios: user.id, plan, prompt" }),
      };
    }

    // 1) Escolhe o modelo certo conforme seu picker
    const model = pickModel(plan, prompt); // ex.: "gpt-5-nano", "gpt-4.1-mini", etc.

    // 2) Aplica bloqueios/contabilização (diário + mensal premium) ANTES da chamada
    await guardAndBill({
      user,
      plan,
      model,
      promptSize: prompt.length,
      expectedOutputSize: 800, // pode ajustar depois
    });

    // 3) Chamada normal à OpenAI (Responses API)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const res = await openai.responses.create({
      model,
      input: prompt,
    });

    // `output_text` é o texto já concatenado
    const text = res.output_text ?? JSON.stringify(res);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
      body: JSON.stringify({ model, text, raw: res }),
    };
  } catch (err) {
    // Se o guardião bloquear, cai aqui com a mensagem de erro configurada
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message || "Erro inesperado" }),
    };
  }
}
