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
    <article
      className={`group overflow-hidden rounded-2xl border border-border/80 bg-surface shadow-sm transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg ${
        isHorizontal ? "flex gap-3 p-2.5 sm:gap-4 sm:p-3" : "flex h-full flex-col"
      }`}
    >
      <Link
        href={`/news/${article.slug}`}
        className={`relative block shrink-0 overflow-hidden bg-border ${
          isHorizontal
            ? "aspect-[4/3] w-28 rounded-xl sm:w-44"
            : "aspect-[16/10] w-full"
        }`}
      >
        <Image
          src={mediaUrl(article.coverImage?.url)}
          alt={article.coverImage?.alternativeText || article.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes={isHorizontal ? "176px" : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"}
        />
        <span className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition group-hover:opacity-100" />
        {article.breaking && (
          <span className="breaking-pill absolute left-3 top-3 shadow-sm">Shoshilinch</span>
        )}
      </Link>

      <div className={`${isHorizontal ? "min-w-0 flex-1 py-1" : "flex flex-1 flex-col p-4 sm:p-5"}`}>
        <div className="mb-2">
          <Link
            href={`/category/${article.category?.slug}`}
            className="text-xs font-bold uppercase tracking-[0.08em] text-primary transition hover:text-secondary"
          >
            {article.category?.name}
          </Link>
        </div>
        <h3 className="mb-2 line-clamp-3 text-base font-bold leading-snug transition group-hover:text-primary sm:text-lg">
          <Link href={`/news/${article.slug}`}>{article.title}</Link>
        </h3>
        {!isHorizontal && (
          <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-muted">{article.excerpt}</p>
        )}
        <div className={!isHorizontal ? "mt-auto" : undefined}>
          <ArticleMeta article={article} compact />
        </div>
      </div>
    </article>
  );
}
