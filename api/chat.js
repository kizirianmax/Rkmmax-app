// api/chat.js
import guardAndBill from "./_utils/guardAndBill.js";
import pickModel from "../src/lib/modelPicker.js";
import OpenAI from "openai";

// CORS + preflight
function applyCORS(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  if (applyCORS(req, res)) return;

  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Use POST", allow: "POST, OPTIONS" });
  }

  try {
    // Next/Vercel às vezes já entrega req.body como objeto
    const body =
      typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { user, plan, prompt } = body;

    if (!user?.id || !plan || !prompt) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios: user.id, plan, prompt" });
    }

    // 1) modelo conforme seu picker
    const model = pickModel(plan, prompt); // ex.: "gpt-4.1-mini", etc.

    // 2) checagem de limites (e já conta 1 requisição)
    const { bill } = await guardAndBill({
      user,
      plan,
      model,
      promptSize: prompt.length,
      expectedOutputSize: 800,
    });

    // 3) chamada OpenAI (Responses API)
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const resp = await openai.responses.create({
      model,
      input: prompt,
    });

    // tenta marcar os tokens reais (se existirem no objeto de uso)
    const outTokens = resp?.usage?.output_tokens;
    try { await bill(outTokens); } catch {}

    const text = resp.output_text ?? JSON.stringify(resp);
    return res.status(200).json({ model, text, raw: resp });
  } catch (err) {
    return res
      .status(400)
      .json({ error: err?.message || "Erro inesperado" });
  }
}
