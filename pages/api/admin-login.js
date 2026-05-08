export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { token } = req.body || {};
  const adminToken = process.env.JETON_ADMIN;

  if (!adminToken) {
    return res.status(500).json({ error: "ADMIN_TOKEN non configuré" });
  }

  if (!token || token !== adminToken) {
    return res.status(401).json({ error: "Token invalide" });
  }

  res.json({ customerId: "admin" });
}
