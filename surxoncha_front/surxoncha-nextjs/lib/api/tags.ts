import "server-only";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "-");
}

/** Vergul bilan ajratilgan tag matnini id massiviga aylantiradi,
 *  mavjud bo'lmagan tag'larni yaratadi. Faqat server-side (route handler) chaqiriladi. */
export async function resolveTagIds(rawTags: string | undefined): Promise<number[]> {
  const names = (rawTags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10);

  const ids: number[] = [];

  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;

    const findRes = await fetch(`${STRAPI_URL}/api/tags?filters[slug][$eq]=${slug}`, {
      headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
    });
    const findJson = await findRes.json();
    const existing = findJson.data?.[0];

    if (existing) {
      ids.push(existing.id);
      continue;
    }

    const createRes = await fetch(`${STRAPI_URL}/api/tags`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${STRAPI_API_TOKEN}`,
      },
      body: JSON.stringify({ data: { name, slug } }),
    });
    if (createRes.ok) {
      const created = await createRes.json();
      ids.push(created.data.id);
    }
  }

  return ids;
}

export async function resolveIdBySlug(
  collection: "categories" | "regions",
  slug: string
): Promise<number | null> {
  if (!slug) return null;
  const res = await fetch(`${STRAPI_URL}/api/${collection}?filters[slug][$eq]=${slug}`, {
    headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` },
  });
  const json = await res.json();
  return json.data?.[0]?.id ?? null;
}
