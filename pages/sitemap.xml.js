export default function Sitemap() { return null; }

export async function getServerSideProps({ res }) {
  const pages = [
    { path: "/", freq: "weekly", priority: "1.0" },
    { path: "/app", freq: "monthly", priority: "0.8" },
    { path: "/cgu", freq: "yearly", priority: "0.3" },
    { path: "/confidentialite", freq: "yearly", priority: "0.3" },
  ];
  const today = new Date().toISOString().slice(0, 10);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url>
    <loc>https://studiovertical.app${p.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${p.freq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join("\n")}
</urlset>`;
  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();
  return { props: {} };
}
