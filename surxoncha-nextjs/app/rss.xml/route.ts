import { getLatestArticlesForRss } from "@/lib/api/articles";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surxoncha.uz";
const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Surxoncha.uz";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const { data: articles } = await getLatestArticlesForRss(30);

  const items = articles
    .map(
      (a) => `
    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${SITE_URL}/news/${a.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/news/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt ?? a.createdAt).toUTCString()}</pubDate>
      <description>${escapeXml(a.excerpt)}</description>
      ${a.author ? `<author>${escapeXml(a.author.displayName)}</author>` : ""}
      ${a.category ? `<category>${escapeXml(a.category.name)}</category>` : ""}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>Surxondaryoni uning o'z yoshlari hikoya qiladi.</description>
    <language>uz</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300",
    },
  });
}
