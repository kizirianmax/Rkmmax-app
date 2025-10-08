// /api/me-plan.js — Vercel Function
export default function handler(req, res) {
  const email = (req.headers["x-user-email"] || "").toLowerCase();

  // TODO: trocar por Supabase quando quiser.
  const premiumList = ["premium@exemplo.com"];
  const plan = premiumList.includes(email) ? "premium" : "basic";

  res.status(200).json({ plan });
}
