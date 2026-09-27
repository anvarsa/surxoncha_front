import { NextResponse } from "next/server";
import { getSession, canSubmitArticles } from "@/lib/auth/session";
import { articleSubmissionSchema } from "@/lib/validation/application";
import { resolveIdBySlug, resolveTagIds } from "@/lib/api/tags";
import { createDraftArticle, submitArticle } from "@/lib/api/articles";

const READING_WORDS_PER_MINUTE = 200;

function estimateReadingTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / READING_WORDS_PER_MINUTE));
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user) {
    return NextResponse.json({ error: "Tizimga kiring." }, { status: 401 });
  }
  if (!canSubmitArticles(session.user.role)) {
    return NextResponse.json(
      {
        error:
          "Maqola yuborish uchun Contributor huquqi kerak. Avval /join orqali ariza yuboring.",
      },
      { status: 403 }
    );
  }
  if (!session.user.authorProfileId) {
    return NextResponse.json(
      { error: "Profilingiz topilmadi. Administratorga murojaat qiling." },
      { status: 400 }
    );
  }

  const body = await request.json();
  const parsed = articleSubmissionSchema.safeParse(body);
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

  try {
    // 1. Draft yaratamiz (server har doim status="draft" qiladi — lifecycles.js).
    const created = await createDraftArticle({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      categoryId,
      regionId: regionId ?? undefined,
      coverImageId: data.coverImageId,
      videoUrl: data.videoUrl || undefined,
      source: data.source || undefined,
      tagIds,
      authorId: session.user.authorProfileId,
      contentType: data.contentType,
      readingTime: estimateReadingTime(data.content),
    });

    const articleId = created.data.id;

    // 2. Darhol "TAHRIRIYATGA YUBORISH" — draft -> submitted.
    const submitted = await submitArticle(articleId);

    return NextResponse.json(
      { success: true, articleId, readingTime: estimateReadingTime(data.content) },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Maqolani saqlashda xatolik yuz berdi. Qaytadan urinib ko'ring." },
      { status: 500 }
    );
  }
}
