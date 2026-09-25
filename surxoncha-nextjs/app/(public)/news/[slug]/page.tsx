import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles } from "@/lib/api/articles";
import { buildArticleMetadata } from "@/lib/seo/metadata";
import { newsArticleSchema, breadcrumbSchema, jsonLd } from "@/lib/seo/structured-data";
import { mediaUrl } from "@/lib/utils";
import { Breadcrumb } from "@/components/common/Breadcrumb";
import { ArticleMeta } from "@/components/article/ArticleMeta";
import { ShareButtons } from "@/components/article/ShareButtons";
import { RelatedArticles } from "@/components/article/RelatedArticles";
import { PhotoGallery } from "@/components/article/PhotoGallery";
import { VideoEmbed } from "@/components/article/VideoEmbed";
import { ViewCounter } from "@/components/article/ViewCounter";
import { AuthorCard } from "@/components/author/AuthorCard";
import { CommentsSection } from "@/components/article/CommentsSection";
import { getArticleComments } from "@/lib/api/comments";
import { ReadingProgress } from "@/components/article/ReadingProgress";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://surxoncha.uz";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Maqola topilmadi | SURXONCHA.UZ" };
  return buildArticleMetadata(article);
}

export const revalidate = 60;

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const related = await getRelatedArticles(article, 4);
  const comments = await getArticleComments(article.id).catch(() => ({ data: [] }));
  const canonical = `${SITE_URL}/news/${article.slug}`;

  const breadcrumbItems = [
    { name: "Bosh sahifa", href: "/" },
    { name: article.category?.name ?? "Yangiliklar", href: `/category/${article.category?.slug}` },
    { name: article.title },
  ];

  return (
    <>
      <ReadingProgress />
      <div className="container py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(newsArticleSchema(article))}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(
          breadcrumbSchema(breadcrumbItems.map((b) => ({ name: b.name, url: b.href ?? canonical })))
        )}
      />
      <ViewCounter articleId={article.id} />

      <div className="max-w-article mx-auto">
        <Breadcrumb items={breadcrumbItems} />

        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-primary"
          >
            {article.category.name}
          </Link>
        )}

        <h1 className="text-h1-mobile md:text-h1-desktop font-extrabold leading-[1.1] mt-2 mb-4">
          {article.title}
        </h1>

        <p className="text-lg text-muted mb-5">{article.excerpt}</p>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-6 pb-6 border-b border-border">
          <ArticleMeta article={article} />
          <ShareButtons url={canonical} title={article.title} />
        </div>

        <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-border mb-8">
          <Image
            src={mediaUrl(article.coverImage?.url)}
            alt={article.coverImage?.alternativeText || article.title}
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 760px, 100vw"
          />
        </div>

        {/* Eslatma: `content` maydoni Strapi rich-text/HTML sifatida saqlanadi
            (CKEditor/Markdown->HTML konvertatsiyasi CMS tomonida bajariladi). */}
        <div
          className="article-prose"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.videoUrl && <VideoEmbed url={article.videoUrl} />}
        {article.gallery && <PhotoGallery gallery={article.gallery} />}

        {article.source && (
          <p className="text-sm text-muted mt-6">
            <span className="font-medium text-text">Manba:</span> {article.source}
          </p>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-6">
            {article.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/search?q=${encodeURIComponent(tag.name)}`}
                className="text-xs rounded-full border border-border px-3 py-1 text-muted hover:border-primary hover:text-primary transition"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        )}

        {article.corrections && article.corrections.length > 0 && (
          <div className="mt-8 rounded border border-secondary/40 bg-secondary/10 px-4 py-3 text-sm">
            {article.corrections.map((c) => (
              <p key={c.id} className="text-text">
                <span className="font-semibold">Tuzatish:</span> {c.note} —{" "}
                <span className="text-muted">
                  {new Intl.DateTimeFormat("uz-Latn", { dateStyle: "long" }).format(
                    new Date(c.correctedAt)
                  )}
                </span>
              </p>
            ))}
          </div>
        )}

        {article.author && (
          <div className="mt-10">
            <AuthorCard author={article.author} />
          </div>
        )}

        <CommentsSection articleId={article.id} comments={comments.data} />

        <div className="mt-10 rounded-lg bg-bg border border-border px-6 py-8 text-center">
          <p className="font-bold mb-1">Bu maqolani siz ham tayyorlamoqchimisiz?</p>
          <p className="text-sm text-muted mb-4">
            Surxondaryo bo'ylab voqealarni birga yoritamiz.
          </p>
          <Link
            href="/join"
            className="inline-block rounded bg-primary text-white font-semibold px-5 py-2.5 text-sm hover:opacity-90"
          >
            Surxoncha jamoasiga qo'shiling
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto">
        <RelatedArticles articles={related} />
      </div>
      </div>
    </>
  );
}
