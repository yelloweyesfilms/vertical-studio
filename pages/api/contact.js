import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { name, email, message } = req.body || {};
  if (!name || !email || !email.includes("@") || !message) {
    return res.status(400).json({ error: "Champs manquants" });
  }
  if (message.length > 2000) {
    return res.status(400).json({ error: "Message trop long" });
  }

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "Config email manquante" });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await resend.emails.send({
      from: "VerticalClap <hello@verticalclap.app>",
      to: "hello@verticalclap.app",
      reply_to: email,
      subject: `Contact — ${name}`,
      html: `
        <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px 16px;">
          <h2 style="font-size:20px;color:#0f172a;margin:0 0 24px;">Nouveau message de contact</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;width:100px;">Nom</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;">${name}</td></tr>
            <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:13px;color:#64748b;">Email</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-size:14px;color:#0f172a;"><a href="mailto:${email}" style="color:#E85C3A;">${email}</a></td></tr>
          </table>
          <div style="margin-top:24px;background:#f8fafc;border-radius:12px;padding:20px;">
            <p style="font-size:13px;color:#64748b;margin:0 0 10px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Message</p>
            <p style="font-size:15px;color:#1e293b;line-height:1.7;margin:0;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
          </div>
          <p style="font-size:12px;color:#94a3b8;margin-top:24px;">Réponds directement à cet email pour contacter ${name}.</p>
        </div>
      `,
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("[contact]", e.message);
    return res.status(500).json({ error: "Erreur envoi" });
  }
}
