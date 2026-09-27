import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";

/**
 * Strapi'dagi "Webhooks" (Settings → Webhooks) shu endpoint'ga POST so'rov
 * yuboradi: entry.create / entry.update / entry.publish / entry.unpublish /
 * entry.delete hodisalarida. Shu orqali maqola nashr qilingan zahoti
 * (ISR revalidate=60s kutmasdan) bosh sahifa, kategoriya va maqola sahifasi
 * yangilanadi — spec 37-band "Excellent Core Web Vitals" talabiga mos.
 *
 * Strapi webhook body strukturasi: { event, model, entry: {...} }
 */

const REVALIDATE_SECRET = process.env.REVALIDATE_SECRET;

const TAG_BY_MODEL: Record<string, string[]> = {
  article: ["articles"],
  category: ["categories"],
  region: ["regions"],
  "author-profile": ["author-profiles"],
  "site-setting": ["site-settings"],
};

export async function POST(request: Request) {
  const secret = request.headers.get("x-revalidate-secret");
  if (!REVALIDATE_SECRET || secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const model: string | undefined = body?.model;
  const entry = body?.entry;

  if (!model || !TAG_BY_MODEL[model]) {
    return NextResponse.json({ error: "unknown model" }, { status: 400 });
  }

  const tags = [...TAG_BY_MODEL[model]];

  // Bitta maqolaga xos tegni ham revalidate qilamiz — /news/[slug] sahifasi
  // butun "articles" ro'yxatini kutmasdan darhol yangilanadi.
  if (model === "article" && entry?.slug) {
    tags.push(`article:${entry.slug}`);
    revalidatePath(`/news/${entry.slug}`, "page");
  }

  for (const tag of tags) {
    revalidateTag(tag, "max");
  }

  // Sайт sozlamalari o'zgarsa, root layout (barcha sahifalar) qayta chiziladi.
  if (model === "site-setting") {
    revalidatePath("/", "layout");
  }

  return NextResponse.json({ revalidated: true, tags });
}
