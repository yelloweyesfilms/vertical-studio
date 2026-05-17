import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = "VerticalClap <hello@verticalclap.app>";
const APP_URL = "https://verticalclap.app";
const RED = "#E85C3A";
const VIO = "#a855f7";
const DARK = "#09090f";

export async function sendWelcomeEmail({ email, plan }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Bienvenue sur VerticalClap — ${plan === "premium" ? "Premium 🎭" : "Standard ⚡"}`,
      html: welcomeHtml(plan),
    });
  } catch (e) {
    console.error("[email] welcome:", e.message);
  }
}

export async function sendReferralRewardEmail({ email, creditEuros }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "🎁 1 mois offert — ton filleul vient de s'abonner !",
      html: referralHtml(creditEuros),
    });
  } catch (e) {
    console.error("[email] referral reward:", e.message);
  }
}

export async function sendCancelEmail({ email }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Ton abonnement VerticalClap a été résilié",
      html: cancelHtml(),
    });
  } catch (e) {
    console.error("[email] cancel:", e.message);
  }
}

export async function sendRelanceEmail({ email }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Ta première série t'attend 🎬",
      html: relanceHtml(),
    });
  } catch (e) {
    console.error("[email] relance:", e.message);
  }
}

function base(title, body) {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head>
<body style="margin:0;padding:0;background:#f1f4f8;font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f4f8;padding:40px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 32px rgba(0,0,0,.10);">
        <!-- Header -->
        <tr>
          <td style="background:${DARK};padding:28px 32px;text-align:center;">
            <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr>
                <td style="background:${RED};border-radius:8px;padding:6px 10px;margin-right:10px;vertical-align:middle;">
                  <span style="color:#fff;font-family:Georgia,serif;font-size:13px;font-weight:900;letter-spacing:1px;">▶</span>
                </td>
                <td style="padding-left:10px;vertical-align:middle;">
                  <span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#f1f5f9;letter-spacing:-0.5px;">Vertical</span><span style="font-family:Georgia,serif;font-size:20px;font-weight:900;color:#E85C3A;letter-spacing:-0.5px;">Clap</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr><td style="padding:36px 32px 28px;">${body}</td></tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f8f9fb;padding:20px 32px;text-align:center;border-top:1px solid #e8ecf0;">
            <p style="font-size:12px;color:#94a3b8;margin:0 0 6px;">
              © 2026 VerticalClap · <a href="${APP_URL}/confidentialite" style="color:#94a3b8;text-decoration:none;">Confidentialité</a> · <a href="${APP_URL}/cgu" style="color:#94a3b8;text-decoration:none;">CGU</a> · <a href="${APP_URL}/contact" style="color:#94a3b8;text-decoration:none;">Contact</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function btn(text, url, gradient = false) {
  const bg = gradient
    ? `background:linear-gradient(135deg,${RED},${VIO});`
    : `background:${RED};`;
  return `<a href="${url}" style="display:inline-block;${bg}color:#fff;text-decoration:none;padding:15px 36px;border-radius:12px;font-size:15px;font-weight:700;margin:20px 0;letter-spacing:-0.2px;">${text}</a>`;
}

function step(icon, title, desc) {
  return `
    <tr>
      <td style="padding-bottom:16px;vertical-align:top;">
        <table cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="width:36px;vertical-align:top;padding-top:2px;">
              <span style="font-size:20px;">${icon}</span>
            </td>
            <td style="padding-left:10px;">
              <p style="font-size:14px;font-weight:700;color:#0f172a;margin:0 0 3px;">${title}</p>
              <p style="font-size:13px;color:#64748b;margin:0;line-height:1.55;">${desc}</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>`;
}

function welcomeHtml(plan) {
  const isPremium = plan === "premium";

  const features = isPremium
    ? [
        "⚡ Fast Drama + 🎭 Premium Suspense",
        "Jusqu'à 90 épisodes par série",
        "🎲 4 variations de script par épisode",
        "🔥 Titres viraux avec score de viralité",
        "🎬 Fiche technique de production",
        "🌍 Traduction en 8 langues",
        "🎨 Affiche IA (DALL-E 3)",
        "☁️ Sauvegarde cloud · 📄 Export PDF",
      ]
    : [
        "⚡ Fast Drama",
        "10 épisodes par série",
        "Scripts 1 à 2 min prêts à tourner",
        "📱 Mode Tournage + Téléprompteur",
        "🌍 Traduction en 8 langues",
        "☁️ Sauvegarde cloud · 📄 Export PDF",
      ];

  const badge = isPremium
    ? `<span style="background:#f3e8ff;color:${VIO};font-size:11px;font-weight:800;padding:5px 14px;border-radius:20px;letter-spacing:1.5px;">🎭 PREMIUM</span>`
    : `<span style="background:#fff0ec;color:${RED};font-size:11px;font-weight:800;padding:5px 14px;border-radius:20px;letter-spacing:1.5px;">⚡ STANDARD</span>`;

  const upsellBlock = !isPremium ? `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:20px;margin-top:24px;">
      <tr><td>
        <p style="font-size:11px;font-weight:800;letter-spacing:2px;text-transform:uppercase;color:${VIO};margin:0 0 10px;">✦ Disponible en Premium</p>
        <p style="font-size:13px;color:#4c1d95;margin:0 0 12px;line-height:1.6;">
          Jusqu'à <strong>90 épisodes</strong>, <strong>4 variations</strong> par script, <strong>titres viraux</strong> et <strong>Affiche IA</strong> — pour +10€/mois.
        </p>
        <a href="${APP_URL}" style="font-size:13px;font-weight:700;color:${VIO};text-decoration:none;">Passer à Premium →</a>
      </td></tr>
    </table>` : "";

  return base("Bienvenue sur VerticalClap", `
    <div style="text-align:center;margin-bottom:24px;">
      ${badge}
    </div>
    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#0f172a;margin:0 0 12px;text-align:center;letter-spacing:-0.5px;line-height:1.2;">
      Ton studio est prêt.<br>Première série en 5 min. 🎬
    </h1>
    <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 28px;text-align:center;">
      Bienvenue ! Génère ta première série verticale — bible, épisodes, scripts, tout est là.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:28px;">
      <tr><td>
        <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin:0 0 14px;">Ton plan inclut</p>
        ${features.map(f => `<p style="font-size:14px;color:#1e293b;margin:0 0 9px;"><span style="color:${isPremium ? VIO : RED};">✓</span> &nbsp;${f}</p>`).join("")}
      </td></tr>
    </table>

    <div style="text-align:center;">
      ${btn("Ouvrir mon studio →", `${APP_URL}/app`, isPremium)}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK};border-radius:14px;padding:22px;margin-top:24px;">
      <tr>
        <td>
          <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${RED};margin:0 0 18px;">Comment démarrer</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${step("🎲", "Le Mixeur", "Choisis univers, casting et secret central — ou utilise un pack en 1 clic.")}
            ${step("📖", "La Bible", "Titre viral, logline et séquencier générés en streaming en quelques secondes.")}
            ${step("📝", "Les Scripts", "Ouvre un épisode → script en 10s. Hook, dialogues, cadrage 9:16.")}
            ${step("📱", "Mode Tournage", "Téléprompteur auto-scroll, fond clair/sombre. Prêt à filmer.")}
          </table>
        </td>
      </tr>
    </table>

    ${upsellBlock}
  `);
}

function referralHtml(creditEuros) {
  return base("1 mois offert !", `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="font-size:52px;margin-bottom:16px;">🎁</div>
      <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#0f172a;margin:0 0 12px;letter-spacing:-0.5px;">
        Ton filleul vient de s'abonner !
      </h1>
      <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0;">
        Un crédit de <strong style="color:${RED};">${creditEuros}€</strong> vient d'être appliqué à ton compte.<br>
        Il sera déduit automatiquement de ton prochain paiement.
      </p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:24px;">
      <tr><td>
        <p style="font-size:13px;color:#1e293b;margin:0;line-height:1.7;">
          💡 <strong>Comment ça marche :</strong> Chaque filleul qui s'abonne avec ton code t'offre 1 mois gratuit. Sans limite.
        </p>
      </td></tr>
    </table>
    <div style="text-align:center;">
      ${btn("Voir mon code de parrainage →", `${APP_URL}/app`)}
    </div>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:12px 0 0;">
      Ton code est disponible dans l'onglet 🎁 Parrainage du studio.
    </p>
  `);
}

function relanceHtml() {
  const packs = [
    { emoji: "🏥", label: "Médical Secret", desc: "Hôpital privé · Double vie" },
    { emoji: "👨‍👩‍👧", label: "Famille Brisée", desc: "Famille recomposée · Enfant caché" },
    { emoji: "💼", label: "Corporate War", desc: "Finance internationale · Sabotage" },
  ];
  return base("Ta première série t'attend", `
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#0f172a;margin:0 0 12px;text-align:center;letter-spacing:-0.5px;line-height:1.3;">
      Ta première série<br>t'attend 🎬
    </h1>
    <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 28px;text-align:center;">
      Tu t'es abonné(e) il y a 3 jours. En 30 secondes, tu peux avoir une bible complète et des scripts prêts à tourner.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK};border-radius:14px;padding:20px;margin-bottom:24px;">
      <tr><td>
        <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${RED};margin:0 0 14px;">3 thèmes pour démarrer</p>
        ${packs.map(p => `
          <table cellpadding="0" cellspacing="0" width="100%" style="background:#1a1a2e;border-radius:10px;margin-bottom:8px;">
            <tr>
              <td style="padding:12px 14px;width:36px;vertical-align:middle;font-size:22px;">${p.emoji}</td>
              <td style="padding:12px 14px 12px 0;vertical-align:middle;">
                <p style="font-size:14px;font-weight:700;color:#f1f5f9;margin:0 0 2px;">${p.label}</p>
                <p style="font-size:12px;color:#64748b;margin:0;">${p.desc}</p>
              </td>
            </tr>
          </table>`).join("")}
      </td></tr>
    </table>
    <div style="text-align:center;">
      ${btn("Générer ma première série →", `${APP_URL}/app`)}
    </div>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:12px 0 0;">
      Ça prend 30 secondes. Vraiment.
    </p>
  `);
}

export async function sendNewsletterWelcomeEmail({ email }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "Bienvenue dans la newsletter VerticalClap 🎬",
      html: newsletterWelcomeHtml(),
    });
  } catch (e) {
    console.error("[email] newsletter-welcome:", e.message);
  }
}

export async function sendWinbackEmail({ email }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "On a encore quelque chose pour toi 🎬",
      html: winbackHtml(),
    });
  } catch (e) {
    console.error("[email] winback:", e.message);
  }
}

export async function sendRelanceJ7Email({ email }) {
  const resend = getResend();
  if (!resend || !email) return;
  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: "7 jours et toujours pas de première série ? 🤔",
      html: relanceJ7Html(),
    });
  } catch (e) {
    console.error("[email] relance-j7:", e.message);
  }
}

function cancelHtml() {
  return base("Abonnement résilié", `
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#0f172a;margin:0 0 12px;text-align:center;letter-spacing:-0.5px;">
      Ton abonnement a été résilié
    </h1>
    <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 24px;text-align:center;">
      Tu gardes l'accès jusqu'à la fin de ta période payée.<br>Tes séries restent sauvegardées dans le cloud.
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:20px;margin-bottom:24px;">
      <tr><td>
        <p style="font-size:13px;color:#1e293b;margin:0;line-height:1.7;">
          Tu peux te réabonner à tout moment et retrouver toutes tes séries exactement là où tu les avais laissées.
        </p>
      </td></tr>
    </table>
    <div style="text-align:center;">
      ${btn("Se réabonner →", `${APP_URL}/#pricing`)}
    </div>
  `);
}

function winbackHtml() {
  return base("On regrette ton départ", `
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:16px;">🎬</div>
      <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#0f172a;margin:0 0 12px;letter-spacing:-0.5px;line-height:1.3;">
        Tes séries t'attendent encore.
      </h1>
      <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0;">
        Tu as résilié ton abonnement VerticalClap.<br>
        Tout ce que tu avais créé est toujours là, sauvegardé.
      </p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK};border-radius:14px;padding:22px;margin-bottom:24px;">
      <tr><td>
        <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${RED};margin:0 0 14px;">Ce que tu retrouveras en revenant</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${step("📖", "Tes bibles sauvegardées", "Toutes tes séries, univers et personnages sont là.")}
          ${step("📝", "Scripts prêts à tourner", "Reprends exactement là où tu t'étais arrêté(e).")}
          ${step("📱", "Mode Tournage", "Téléprompteur, fond adapté, prêt en 10 secondes.")}
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f0;border:1px solid #fcd9cc;border-radius:14px;padding:20px;margin-bottom:24px;">
      <tr><td style="text-align:center;">
        <p style="font-size:13px;font-weight:700;color:${RED};margin:0 0 6px;letter-spacing:0.5px;">💡 On te propose</p>
        <p style="font-size:14px;color:#1e293b;margin:0;line-height:1.6;">
          Reprends dès aujourd'hui — ton premier mois Standard à <strong>9€</strong> au lieu de 14€.
        </p>
      </td></tr>
    </table>

    <div style="text-align:center;">
      ${btn("Reprendre mon studio →", `${APP_URL}/tarifs`, true)}
    </div>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:12px 0 0;">
      Ce lien est valable 7 jours. Reprends quand tu veux.
    </p>
  `);
}

function relanceJ7Html() {
  const tips = [
    { emoji: "⚡", title: "Utilise un pack", desc: "1 clic → thème, casting et secret pré-remplis." },
    { emoji: "🎲", title: "Laisse le mixeur décider", desc: "Appuie sur \"Surprise\" — on génère tout pour toi." },
    { emoji: "📱", title: "Filme directement", desc: "Mode Tournage : téléprompteur auto-scroll intégré." },
  ];
  return base("7 jours — et ta première série ?", `
    <h1 style="font-family:Georgia,serif;font-size:26px;font-weight:900;color:#0f172a;margin:0 0 12px;text-align:center;letter-spacing:-0.5px;line-height:1.3;">
      7 jours.<br>Toujours pas de première série ? 🤔
    </h1>
    <p style="font-size:15px;color:#64748b;line-height:1.7;margin:0 0 28px;text-align:center;">
      Ton studio est là, prêt. Une série complète prend moins de 5 minutes à générer — bible, épisodes, scripts inclus.
    </p>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:${DARK};border-radius:14px;padding:22px;margin-bottom:24px;">
      <tr><td>
        <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${VIO};margin:0 0 14px;">3 astuces pour démarrer vite</p>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${tips.map(t => step(t.emoji, t.title, t.desc)).join("")}
        </table>
      </td></tr>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:14px;padding:18px;margin-bottom:24px;">
      <tr><td>
        <p style="font-size:13px;color:#4c1d95;margin:0;line-height:1.7;text-align:center;">
          🎯 <strong>Objectif :</strong> Une série générée en 5 min. Un épisode filmé cette semaine.
        </p>
      </td></tr>
    </table>

    <div style="text-align:center;">
      ${btn("Générer ma première série →", `${APP_URL}/app`, true)}
    </div>
    <p style="font-size:13px;color:#94a3b8;text-align:center;margin:12px 0 0;">
      Des questions ? Réponds directement à cet email — on est là.
    </p>
  `);
}

function newsletterWelcomeHtml() {
  const articles = [
    { title: "Qu'est-ce qu'un micro-drama vertical ?", url: `${APP_URL}/blog/qu-est-ce-qu-un-micro-drama`, label: "Guide", time: "7 min", color: RED, emoji: "🎬" },
    { title: "Écrire un hook TikTok irrésistible", url: `${APP_URL}/blog/comment-ecrire-un-hook-tiktok`, label: "Écriture", time: "5 min", color: VIO, emoji: "⚡" },
    { title: "TikTok vs DramaBox vs ReelShort — où publier ?", url: `${APP_URL}/blog/tiktok-vs-dramabox-vs-reelshort-ou-publier-micro-drama`, label: "Distribution", time: "9 min", color: "#4ade80", emoji: "🌍" },
  ];

  const platforms = [
    { name: "TikTok", color: "#69C9D0" },
    { name: "Reels", color: VIO },
    { name: "Shorts", color: RED },
    { name: "DramaBox", color: "#f59e0b" },
    { name: "ReelShort", color: "#e879f9" },
  ];

  return base("Bienvenue dans la newsletter VerticalClap", `

    <!-- HERO -->
    <div style="background:${DARK};border-radius:16px;padding:32px 28px;margin-bottom:6px;text-align:center;">
      <p style="font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${RED};margin:0 0 14px;">Bienvenue 🎬</p>
      <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:900;color:#f1f5f9;margin:0 0 14px;letter-spacing:-0.5px;line-height:1.25;">
        Le studio IA des créateurs<br>de micro-dramas verticaux.
      </h1>
      <p style="font-size:15px;color:#94a3b8;line-height:1.7;margin:0 0 20px;">
        Chaque semaine : conseils, tendances et ressources pour créer et monétiser tes séries. Rien de superflu.
      </p>
      <div style="display:inline-block;background:rgba(232,92,58,0.12);border:1px solid rgba(232,92,58,0.3);border-radius:10px;padding:10px 20px;">
        <p style="font-size:13px;color:#f1f5f9;margin:0;font-weight:600;">
          📱 Bible · Scripts · Hooks · Cliffhangers<br>
          <span style="font-size:12px;color:#94a3b8;font-weight:400;">Prêts à tourner en 5 minutes</span>
        </p>
      </div>
    </div>

    <!-- SÉPARATEUR -->
    <div style="height:6px;background:linear-gradient(90deg,${RED},${VIO});border-radius:0 0 8px 8px;margin-bottom:24px;"></div>

    <!-- CONCEPT EN 3 ÉTAPES -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:6px;">
      <tr>
        <td style="background:#fff8f6;border:1px solid #fde8e0;border-radius:12px;padding:20px;vertical-align:top;width:32%;">
          <p style="font-size:28px;margin:0 0 8px;text-align:center;">🎲</p>
          <p style="font-size:13px;font-weight:800;color:#1e293b;margin:0 0 6px;text-align:center;">1. Le Mixeur</p>
          <p style="font-size:12px;color:#64748b;margin:0;text-align:center;line-height:1.5;">Choisis ton univers, casting &amp; secret central</p>
        </td>
        <td style="width:2%;"></td>
        <td style="background:#f8f4ff;border:1px solid #e9d5ff;border-radius:12px;padding:20px;vertical-align:top;width:32%;">
          <p style="font-size:28px;margin:0 0 8px;text-align:center;">📖</p>
          <p style="font-size:13px;font-weight:800;color:#1e293b;margin:0 0 6px;text-align:center;">2. La Bible</p>
          <p style="font-size:12px;color:#64748b;margin:0;text-align:center;line-height:1.5;">Titre, logline, personnages générés en live</p>
        </td>
        <td style="width:2%;"></td>
        <td style="background:#f0fff4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;vertical-align:top;width:32%;">
          <p style="font-size:28px;margin:0 0 8px;text-align:center;">🎬</p>
          <p style="font-size:13px;font-weight:800;color:#1e293b;margin:0 0 6px;text-align:center;">3. Tourne</p>
          <p style="font-size:12px;color:#64748b;margin:0;text-align:center;line-height:1.5;">Script + téléprompteur. Prêt à filmer.</p>
        </td>
      </tr>
    </table>

    <!-- SÉPARATEUR -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:24px 0;"></div>

    <!-- PLATEFORMES -->
    <div style="text-align:center;margin-bottom:24px;">
      <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin:0 0 16px;">Compatible avec toutes les plateformes</p>
      <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
        <tr>
          ${platforms.map(p => `
          <td style="padding:0 6px;text-align:center;">
            <div style="background:${p.color}18;border:1px solid ${p.color}35;border-radius:8px;padding:8px 12px;display:inline-block;">
              <span style="font-size:11px;font-weight:800;color:${p.color};letter-spacing:0.5px;">${p.name}</span>
            </div>
          </td>`).join("")}
        </tr>
      </table>
    </div>

    <!-- SÉPARATEUR -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:0 0 24px;"></div>

    <!-- ARTICLES -->
    <p style="font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#1e293b;margin:0 0 16px;">Pour commencer — 3 articles essentiels</p>
    ${articles.map(a => `
    <a href="${a.url}" style="text-decoration:none;display:block;margin-bottom:12px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;overflow:hidden;">
        <tr>
          <td style="background:${a.color};width:6px;padding:0;"></td>
          <td style="padding:18px 20px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td>
                  <p style="font-size:16px;font-weight:800;color:#1e293b;margin:0 0 6px;line-height:1.3;">${a.emoji} ${a.title}</p>
                  <p style="font-size:12px;color:#64748b;margin:0;font-weight:600;">${a.label} · ${a.time} de lecture</p>
                </td>
                <td style="text-align:right;vertical-align:middle;padding-left:16px;white-space:nowrap;">
                  <span style="font-size:18px;color:${a.color};font-weight:900;">→</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </a>`).join("")}

    <!-- SÉPARATEUR -->
    <div style="height:1px;background:linear-gradient(90deg,transparent,#e2e8f0,transparent);margin:24px 0;"></div>

    <!-- CTA -->
    <div style="text-align:center;">
      <p style="font-size:15px;font-weight:700;color:#1e293b;margin:0 0 6px;">Regarde comment ça marche →</p>
      <p style="font-size:13px;color:#64748b;margin:0 0 20px;">Bible + scripts d'une série complète. Gratuit à consulter.</p>
      ${btn("Voir les séries exemples →", `${APP_URL}/exemples`, true)}
    </div>
  `);
}
