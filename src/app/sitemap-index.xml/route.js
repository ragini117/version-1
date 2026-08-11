export const dynamic = "force-dynamic";

export async function GET() {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">

  <sitemap>
    <loc>https://decentrawood.com/sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>https://ai.decentrawood.com/sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>https://music.decentrawood.com/sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>https://gaming.decentrawood.com/sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>https://culture.decentrawood.com/sitemap.xml</loc>
  </sitemap>

  <sitemap>
    <loc>https://glamour.decentrawood.com/sitemap.xml</loc>
  </sitemap>

</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
