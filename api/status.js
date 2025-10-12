// api/status.js
export default function handler(req, res) {
  if (req.method && !["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).json({ ok: false, error: "Method Not Allowed" });
  }
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({
    ok: true,
    uptime: process.uptime(),
    timestamp: Date.now(),
  });
}
