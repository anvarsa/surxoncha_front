import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { ArticleMeta } from "./ArticleMeta";

export function ArticleCard({
  article,
  orientation = "vertical",
}: {
  article: Article;
  orientation?: "vertical" | "horizontal";
}) {
  const isHorizontal = orientation === "horizontal";

  return (
    <article className={`group ${isHorizontal ? "flex gap-4" : ""}`}>
      <Link
        href={`/news/${article.slug}`}
        className={`relative block overflow-hidden rounded bg-border ${
          isHorizontal ? "w-32 sm:w-44 shrink-0 aspect-[4/3]" : "aspect-[16/10] mb-3"
        }`}
      >
        <Image
          src={mediaUrl(article.coverImage?.url)}
          alt={article.coverImage?.alternativeText || article.title}
          fill
          className="object-cover transition group-hover:scale-[1.03]"
          sizes={isHorizontal ? "176px" : "(min-width: 768px) 33vw, 100vw"}
        />
        {article.breaking && (
          <span className="breaking-pill absolute top-2 left-2">Shoshilinch</span>
        )}
      </Link>

      <div className={isHorizontal ? "flex-1 min-w-0" : ""}>
        <div className="mb-1.5">
          <Link
            href={`/category/${article.category?.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-primary"
          >
            {article.category?.name}
          </Link>
        </div>
        <h3 className="font-bold leading-snug mb-1.5 group-hover:text-primary transition">
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        {!isHorizontal && (
          <p className="text-sm text-muted mb-2 line-clamp-2">{article.excerpt}</p>
        )}
        <ArticleMeta article={article} compact />
      </div>
    </article>
  );
}
