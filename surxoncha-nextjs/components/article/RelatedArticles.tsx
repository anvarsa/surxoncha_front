import type { Article } from "@/types/content";
import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-border">
      <h2 className="text-lg font-bold mb-5">O'xshash maqolalar</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
