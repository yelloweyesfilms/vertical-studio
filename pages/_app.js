import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";

const SITE = "https://verticalclap.app";
const TITLE = "VerticalClap — Micro-dramas 9:16 en 5 minutes avec l'IA";
const DESC = "Génère des micro-dramas verticaux complets : bible, scripts, hooks et cliffhangers. Prêts à tourner sur TikTok, Reels et Shorts.";
const OG_IMAGE = `${SITE}/api/og?v=2`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="google" content="notranslate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#09090f" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />

        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content="micro-drama, vertical, 9:16, TikTok, Reels, Shorts, scénario, script, IA, générateur" />
        <link rel="canonical" href={SITE} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="VerticalClap" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "VerticalClap",
          "description": DESC,
          "url": SITE,
          "applicationCategory": "CreativeApplication",
          "operatingSystem": "Web",
          "offers": [
            { "@type": "Offer", "price": "9", "priceCurrency": "EUR", "name": "Standard", "description": "Génération de micro-dramas 9:16 avec IA, 10 épisodes par série" },
            { "@type": "Offer", "price": "19", "priceCurrency": "EUR", "name": "Premium", "description": "Fast Drama + Premium Suspense, 90 épisodes, 3 variations par script" },
          ],
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5", "reviewCount": "50" },
        }) }} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  );
}
