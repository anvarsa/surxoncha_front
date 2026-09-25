import Link from "next/link";
import { Clock } from "lucide-react";
import type { Article } from "@/types/content";
import { formatRelativeTime } from "@/lib/utils";

export function ArticleMeta({ article, compact }: { article: Article; compact?: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-muted ${compact ? "text-xs" : "text-sm"}`}>
      {article.author && (
        <Link href={`/authors/${article.author.username}`} className="font-medium text-text hover:text-primary">
          {article.author.displayName}
        </Link>
      )}
      <span aria-hidden>·</span>
      <time dateTime={article.publishedAt}>{formatRelativeTime(article.publishedAt)}</time>
      {!compact && article.readingTime ? (
        <>
          <span aria-hidden>·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" /> {article.readingTime} daq
          </span>
        </>
      ) : null}
    </div>
  );
}
