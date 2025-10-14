// api/cors.js
export default function handler(req, res) {
  // Use ORIGIN definida nas ENVs da Vercel (opcional),
  // senão usa o Origin do request ou libera tudo (*)
  const origin = process.env.ORIGIN || req.headers.origin || "*";

  // Cabeçalhos CORS básicos
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,x-api-token"
  );

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Resposta padrão (para teste)
  res.setHeader("Content-Type", "application/json");
  return res.status(200).json({ ok: true });
}
