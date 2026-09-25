import { NextResponse } from "next/server";
import { getSession, canSubmitArticles } from "@/lib/auth/session";
import { articleSubmissionSchema } from "@/lib/validation/application";
import { resolveIdBySlug, resolveTagIds } from "@/lib/api/tags";

const STRAPI_URL = process.env.STRAPI_URL;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Tizimga kiring." }, { status: 401 });
  }
  if (!canSubmitArticles(session.user.role)) {
    return NextResponse.json({ error: "Ruxsat yo'q." }, { status: 403 });
  }

  const body = await request.json();
  const { resubmit, ...rest } = body as { resubmit?: boolean } & Record<string, unknown>;
  const parsed = articleSubmissionSchema.safeParse(rest);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation_error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;
  const categoryId = await resolveIdBySlug("categories", data.categorySlug);
  if (!categoryId) {
    return NextResponse.json({ error: "Kategoriya topilmadi." }, { status: 400 });
  }
  const regionId = data.regionSlug ? await resolveIdBySlug("regions", data.regionSlug) : undefined;
  const tagIds = await resolveTagIds(data.tags);

  // Muallifning O'Z JWT'i bilan yangilaymiz — Strapi'dagi is-owner-or-editor
  // policy shu tokendan foydalanuvchi ID'sini o'qib, egalikni tekshiradi.
  const updateRes = await fetch(`${STRAPI_URL}/api/articles/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.strapiJwt}`,
    },
    body: JSON.stringify({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        category: categoryId,
        region: regionId,
        coverImage: data.coverImageId,
        videoUrl: data.videoUrl || undefined,
        source: data.source || undefined,
        tags: tagIds,
        contentType: data.contentType,
      },
    }),
  });

  if (!updateRes.ok) {
    const errJson = await updateRes.json().catch(() => ({}));
    return NextResponse.json(
      { error: errJson?.error?.message || "Saqlashda xatolik yuz berdi." },
      { status: updateRes.status }
    );
  }

  if (resubmit) {
    const submitRes = await fetch(`${STRAPI_URL}/api/articles/${id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.strapiJwt}`,
      },
    });
    if (!submitRes.ok) {
      const errJson = await submitRes.json().catch(() => ({}));
      return NextResponse.json(
        {
          warning: "Maqola saqlandi, lekin qayta yuborishda xatolik yuz berdi.",
          detail: errJson?.error?.message,
        },
        { status: 207 }
      );
    }
  }

  return NextResponse.json({ success: true });
}
