import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { ArticleMeta } from "./ArticleMeta";

export function HeroArticle({ article }: { article: Article }) {
  return (
    <article className="grid md:grid-cols-2 gap-6 md:gap-10 items-stretch">
      <Link
        href={`/news/${article.slug}`}
        className="relative block overflow-hidden rounded bg-border aspect-[4/3] md:aspect-auto"
      >
        <Image
          src={mediaUrl(article.coverImage?.url)}
          alt={article.coverImage?.alternativeText || article.title}
          fill
          priority
          className="object-cover"
          sizes="(min-width: 768px) 50vw, 100vw"
        />
        {article.breaking && (
          <span className="breaking-pill absolute top-3 left-3">Shoshilinch</span>
        )}
      </Link>

      <div className="flex flex-col justify-center">
        {article.category && (
          <Link
            href={`/category/${article.category.slug}`}
            className="text-xs font-semibold uppercase tracking-wide text-primary mb-3"
          >
            {article.category.name}
          </Link>
        )}
        <h1 className="text-h1-mobile md:text-h1-desktop font-extrabold leading-[1.08] mb-4">
          <Link href={`/news/${article.slug}`} className="hover:opacity-80 transition">
            {article.title}
          </Link>
        </h1>
        <p className="text-muted mb-5 max-w-md">{article.excerpt}</p>
        <div className="mb-5">
          <ArticleMeta article={article} />
        </div>
        <Link
          href={`/news/${article.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary w-fit hover:gap-2.5 transition-all"
        >
          Maqolani o'qish <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
