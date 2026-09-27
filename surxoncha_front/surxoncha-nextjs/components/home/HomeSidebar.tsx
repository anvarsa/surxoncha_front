import Link from "next/link";
import type { Article } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { ArticleMeta } from "@/components/article/ArticleMeta";

function SidebarList({ articles }: { articles: Article[] }) {
  return (
    <div className="space-y-4">
      {articles.map((article, index) => (
        <article key={article.id} className="flex gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-xs font-extrabold text-primary">
            {index + 1}
          </span>
          <div className="min-w-0">
            <Link
              href={`/news/${article.slug}`}
              className="line-clamp-2 text-sm font-bold leading-snug hover:text-primary"
            >
              {article.title}
            </Link>
            <ArticleMeta article={article} compact />
          </div>
        </article>
      ))}
    </div>
  );
}

export function HomeSidebar({ popular, latest }: { popular: Article[]; latest: Article[] }) {
  return (
    <aside className="space-y-8 lg:border-l lg:border-border lg:pl-6">
      {popular.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-extrabold">Eng ko'p ko'rilgan</h2>
          <SidebarList articles={popular} />
        </section>
      )}
      {latest.length > 0 && (
        <section className="border-t border-border pt-6">
          <h2 className="mb-4 text-lg font-extrabold">So'nggi joylanganlar</h2>
          <SidebarList articles={latest.slice(0, 5)} />
        </section>
      )}
    </aside>
  );
}