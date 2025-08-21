// src/pages/api/admin/session.js
export default function handler(req, res) {
  const secure = process.env.NODE_ENV === "production";

  if (req.method === "POST") {
    // vytvor admin session (1 týždeň)
    res.setHeader("Set-Cookie",
      `gb_admin=1; Path=/; Max-Age=604800; SameSite=Lax; ${secure ? "Secure;" : ""}`
    );
    return res.status(200).json({ ok: true });
  }

  if (req.method === "DELETE") {
    // zmaž admin session
    res.setHeader("Set-Cookie",
      `gb_admin=; Path=/; Max-Age=0; SameSite=Lax; ${secure ? "Secure;" : ""}`
    );
    return res.status(200).json({ ok: true });
  }

  res.setHeader("Allow", "POST, DELETE");
  return res.status(405).end("Method Not Allowed");
}
