import Link from "next/link";
import Image from "next/image";
import type { Article } from "@/types/content";
import { mediaUrl, formatRelativeTime } from "@/lib/utils";
import { EditorialStatusBadge } from "./EditorialStatusBadge";

const EDITABLE_STATUSES = ["draft", "revision_requested"];

export function DashboardArticleRow({ article }: { article: Article }) {
  const editable = EDITABLE_STATUSES.includes(article.status);

  return (
    <div className="flex items-center gap-4 py-3.5 border-b border-border last:border-0">
      <div className="relative h-14 w-20 shrink-0 rounded overflow-hidden bg-border">
        <Image
          src={mediaUrl(article.coverImage?.url)}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium truncate">{article.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <EditorialStatusBadge status={article.status} />
          <span className="text-xs text-muted">{formatRelativeTime(article.updatedAt)}</span>
        </div>
      </div>
      <div className="shrink-0 flex items-center gap-2">
        {editable && (
          <Link
            href={`/dashboard/articles/${article.id}/edit`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Tahrirlash
          </Link>
        )}
        {article.status === "published" && (
          <Link
            href={`/news/${article.slug}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Ko'rish
          </Link>
        )}
      </div>
    </div>
  );
}
