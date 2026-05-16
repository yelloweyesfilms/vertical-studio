import { sendNewsletterWelcomeEmail } from "../../lib/email";

export default async function handler(req, res) {
  const secret = req.query.secret || req.body?.secret;
  if (secret !== process.env.CRON_SECRET) {
    return res.status(401).json({ error: "Non autorisé" });
  }

  const email = req.query.email || req.body?.email;
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Paramètre ?email=ton@email.com requis" });
  }

  try {
    await sendNewsletterWelcomeEmail({ email });
    return res.json({ ok: true, sent: true, to: email });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
}
