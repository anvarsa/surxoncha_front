import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

const STRAPI_URL = process.env.STRAPI_URL;
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN; // write-scoped, server-only

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0400-\u04FF\s-]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Tizimga kiring." }, { status: 401 });
  }

  const { tags } = (await request.json()) as { tags: string };
  const names = (tags || "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .slice(0, 10); // spam'ning oldini olish uchun cheklov

  const ids: number[] = [];

  for (const name of names) {
    const slug = slugify(name);
    if (!slug) continue;

    const findRes = await fetch(
      `${STRAPI_URL}/api/tags?filters[slug][$eq]=${slug}`,
      { headers: { Authorization: `Bearer ${STRAPI_API_TOKEN}` } }
    );
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

  return NextResponse.json({ ids });
}
