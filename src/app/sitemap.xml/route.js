export const dynamic = "force-dynamic";

const BASE_URL = "https://decentrawood.com";

const staticPaths = [
  "",
  "what-is-decentrawood",
  "socialzone",
  "dao",
  "metaverse",
  "private-policy",
  "about-us",
  "blog",
  "overview",
  "deodtoken",
  "governance",
  "proposal",
  "community",
  "termscondition",
  "deod-is-now-live-on-coindcx-one-of-asias-top-crypto-exchanges-52",
  "how-agentic-ai-is-changing-web3-gaming-forever-50",
  "exploring-earning-opportunities-within-the-decentrawood-ecosystem-49",
  "top-factors-driving-deods-growth-potential-toward-2026-48",
  "exploring-deod-ai-opportunities-for-learning-productivity-and-digital-income-47",
  "decentrawood-launches-800-deod-giveaway-for-decentralized-wallet-holders-51",
  "exploring-earning-opportunities-within-the-decentrawood-ecosystem-49",
  "top-factors-driving-deods-growth-potential-toward-2026-48",
  "exploring-deod-ai-opportunities-for-learning-productivity-and-digital-income-47",
  "how-expanding-utility-is-strengthening-deods-long-term-market-position-46",
  "can-deod-reach-2-by-2026-a-realistic-price-breakdown-45",
  "how-to-increase-your-chances-in-the-deod-airdrop-44",
  "160000-users-joined-but-only-a-few-are-positioned-heres-why-43",
];

async function getDynamicPages() {
  return [
    "news/official-announcement-deod-smart-contract-upgrade",
  ];
}

export async function GET() {
  const dynamicPages = await getDynamicPages();
  const allPages = [...staticPaths, ...dynamicPages];

  const urls = allPages
    .map((path) => {
      const url = path ? `${BASE_URL}/${path}` : BASE_URL;

      return `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>${path === "" ? "1.0" : "0.9"}</priority>
        </url>
      `;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
