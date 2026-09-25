import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/session";
import { getSession } from "@/lib/auth/session";
import { getArticleForEdit } from "@/lib/api/dashboard";
import { getAllCategories } from "@/lib/api/categories";
import { getAllRegions } from "@/lib/api/regions";
import { SubmitArticleForm } from "@/components/forms/SubmitArticleForm";
import { mediaUrl } from "@/lib/utils";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = { title: "Maqolani tahrirlash | SURXONCHA.UZ", ...noIndexMetadata };

const RESUBMITTABLE_STATUSES = ["draft", "revision_requested"];

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const session = await getSession();
  if (!session) return null;
  const { id } = await params;

  const [{ data: article }, { data: categories }, { data: regions }] = await Promise.all([
    getArticleForEdit(session.strapiJwt, Number(id)),
    getAllCategories(),
    getAllRegions(),
  ]);

  if (!article) notFound();

  return (
    <div className="min-h-screen bg-bg py-10">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Maqolani tahrirlash</h1>
        <p className="text-sm text-muted mb-1">
          Holat: <span className="font-medium text-text">{article.status}</span>
        </p>
        {article.status === "revision_requested" && article.corrections && article.corrections.length > 0 && (
          <div className="mt-3 mb-4 rounded border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm">
            <p className="font-semibold mb-1">Muharrir izohi:</p>
            <p>{article.corrections[article.corrections.length - 1]?.note}</p>
          </div>
        )}
        <div className="bg-surface border border-border rounded-lg p-6 sm:p-8 mt-4">
          <SubmitArticleForm
            categories={categories}
            regions={regions}
            editMode={{
              articleId: article.id,
              canResubmit: RESUBMITTABLE_STATUSES.includes(article.status),
              initialValues: {
                contentType: article.contentType,
                title: article.title,
                slug: article.slug,
                categorySlug: article.category?.slug ?? "",
                regionSlug: article.region?.slug ?? "",
                excerpt: article.excerpt,
                content: article.content,
                coverImageId: article.coverImage?.id ?? null,
                coverImageUrl: article.coverImage?.url ? mediaUrl(article.coverImage.url) : undefined,
                videoUrl: article.videoUrl ?? "",
                source: article.source ?? "",
                tags: article.tags?.map((t) => t.name).join(", ") ?? "",
                authorNotes: "",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
