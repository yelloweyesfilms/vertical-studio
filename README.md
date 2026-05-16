# 🎬 Vertical Clap

Studio de micro-dramas verticaux avec IA. Scripts 1-2 min, format 9:16, prêts à tourner.

---

## 🚀 Déploiement en 15 minutes

### 1. Prérequis
- Compte [GitHub](https://github.com) (gratuit)
- Compte [Vercel](https://vercel.com) (gratuit)
- Compte [Stripe](https://stripe.com) (gratuit, commission sur ventes)
- Compte [Anthropic](https://console.anthropic.com) (pay-as-you-go)

---

### 2. Mettre le projet sur GitHub

```bash
# Dans le dossier vertical-app :
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TON_USERNAME/vertical-studio.git
git push -u origin main
```

---

### 3. Déployer sur Vercel

1. Va sur [vercel.com](https://vercel.com) → **New Project**
2. **Import** ton repo GitHub `vertical-app`
3. Clique **Deploy** (ça marche sans config)
4. Note ton URL : `https://vertical-studio-xxx.vercel.app`

---

### 4. Configurer Stripe

1. Va sur [dashboard.stripe.com](https://dashboard.stripe.com)
2. **Products** → **Add Product**
   - Nom : `Vertical App Pro`
   - Prix : `9.00 EUR` / mois (récurrent)
   - Copie le **Price ID** (commence par `price_`)
3. **Developers** → **API Keys** → copie `Publishable key` et `Secret key`
4. **Developers** → **Webhooks** → **Add endpoint**
   - URL : `https://TON_URL.vercel.app/api/webhook`
   - Events : `customer.subscription.created`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copie le **Webhook signing secret** (`whsec_`)

---

### 5. Configurer Anthropic

1. Va sur [console.anthropic.com](https://console.anthropic.com)
2. **API Keys** → **Create Key**
3. Mets une limite de budget mensuelle (ex: 50€)

---

### 6. Variables d'environnement Vercel

Dans Vercel → ton projet → **Settings** → **Environment Variables** :

```
ANTHROPIC_API_KEY          = sk-ant-xxxxx
STRIPE_SECRET_KEY          = sk_live_xxxxx
STRIPE_WEBHOOK_SECRET      = whsec_xxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_xxxxx
STRIPE_PRICE_ID            = price_xxxxx
NEXT_PUBLIC_URL            = https://TON_URL.vercel.app
```

Redéploie après avoir ajouté les variables : **Deployments** → **Redeploy**.

---

### 7. Tester

1. Va sur `https://TON_URL.vercel.app`
2. Entre un email et clique **Commencer**
3. Stripe te redirige → paye avec la carte test `4242 4242 4242 4242`
4. Tu arrives sur `/app` → génère ta première série !

---

## 💰 Modèle économique

| | Coût |
|---|---|
| Vercel hosting | Gratuit |
| Stripe commission | 1.4% + 0.25€ par transaction |
| Coût API par série générée | ~0.02€ |
| **Prix abonnement** | **9€/mois** |
| **Marge à 100 abonnés** | **~860€/mois** |

---

## 🛠 Développement local

```bash
npm install
cp .env.example .env.local
# Remplis .env.local avec tes vraies clés
npm run dev
# → http://localhost:3000
```

---

## 📁 Structure

```
├── pages/
│   ├── index.js          # Landing page
│   ├── app.js            # L'application (protégée)
│   └── api/
│       ├── generate.js   # Génération IA (protégée par Stripe)
│       ├── checkout.js   # Création session Stripe
│       ├── session.js    # Récupération customer après paiement
│       └── webhook.js    # Events Stripe
├── lib/
│   ├── anthropic.js      # Client Anthropic
│   ├── stripe.js         # Client Stripe
│   └── auth.js           # Vérification abonnement
└── styles/
    └── globals.css
```
