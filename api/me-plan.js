// /api/me-plan.js — Vercel Function
export default function handler(req, res) {
  try {
    const raw = (req.headers["x-user-email"] ?? req.query.email ?? "").toString();
    const email = raw.trim().toLowerCase();

    // Lê da env PREMIUM_EMAILS: "email1@dominio.com, email2@dominio.com"
    const envList = (process.env.PREMIUM_EMAILS || "")
      .split(",")
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    // fallback se a env não estiver setada
    const premiumList = new Set(
      envList.length ? envList : ["premium@exemplo.com", "seu-email@exemplo.com"]
    );

    const plan = premiumList.has(email) ? "premium" : "basic";
    res.status(200).json({ plan });
  } catch {
    // Em qualquer erro, devolve basic
    res.status(200).json({ plan: "basic" });
  }
}
