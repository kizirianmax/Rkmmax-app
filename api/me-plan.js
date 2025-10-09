// /api/me-plan.js — Vercel Function
export default function handler(req, res) {
  // aceita header x-user-email e também ?email= para testes
  const raw =
    (req.headers["x-user-email"] ?? req.query.email ?? "").toString();
  const email = raw.trim().toLowerCase();

  // TODO: substituir por Supabase quando quiser
  const premiumList = new Set([
    "premium@exemplo.com",
    "seu-email@exemplo.com", // <-- coloque o seu aqui
  ]);

  const plan = premiumList.has(email) ? "premium" : "basic";
  res.status(200).json({ plan });
}
