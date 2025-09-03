// netlify/functions/chat.js
import OpenAI from "openai";

export const handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const { model, messages } = JSON.parse(event.body || "{}");
    if (!model || !messages) {
      return { statusCode: 400, body: "Missing model or messages" };
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const resp = await client.chat.completions.create({
      model,
      messages, // [{role:"user", content:"..."}]
      temperature: 0.6,
      max_tokens: 800,
    });

    const reply = resp.choices?.[0]?.message?.content ?? "";
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message }),
    };
  }
};
