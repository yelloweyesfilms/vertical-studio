import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";

const SITE = "https://studiovertical.app";
const TITLE = "Studio Vertical — Micro-dramas 9:16 en 5 minutes avec l'IA";
const DESC = "Génère des micro-dramas verticaux complets : bible, scripts, hooks et cliffhangers. Prêts à tourner sur TikTok, Reels et Shorts.";
const OG_IMAGE = `${SITE}/og.png`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="google" content="notranslate" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="theme-color" content="#0F1A12" />

        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <meta name="keywords" content="micro-drama, vertical, 9:16, TikTok, Reels, Shorts, scénario, script, IA, générateur" />
        <link rel="canonical" href={SITE} />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={OG_IMAGE} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="Studio Vertical" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <meta name="twitter:image" content={OG_IMAGE} />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Script src="https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js" strategy="afterInteractive" />
      <Component {...pageProps} />
    </>
  );
}
