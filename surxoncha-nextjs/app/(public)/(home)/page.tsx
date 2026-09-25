import Link from "next/link";
import type { Article } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { getHomepageArticles } from "@/lib/api/articles";
import { HeroArticle } from "@/components/article/HeroArticle";
import { ArticleCard } from "@/components/article/ArticleCard";
import { PopularWithSocial } from "@/components/home/PopularWithSocial";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { RelatedArticles } from "@/components/article/RelatedArticles";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const result = await getHomepageArticles();
  const { hero, latest, popular, byCategory } = result;

  return (
    <main className="space-y-16">
      {/* Hero article */}
      {hero && <HeroArticle article={hero} />}

      {/* Popular articles with social media */}
      <section className="container">
        <PopularWithSocial articles={popular} />
      </section>

      {/* Main content grid */}
      <div className="container grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
        {/* Left: Latest articles */}
        <div className="lg:col-span-2">
          {latest.length > 0 && (
            <section>
              <h2 className="mb-6 text-2xl font-extrabold">So'nggi yangiliklar</h2>
              <div className="space-y-6">
                {latest.map((article) => (
                  <ArticleCard key={article.id} article={article} orientation="horizontal" />
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right: Sidebar */}
        <aside>
          <HomeSidebar popular={popular} latest={latest} />
        </aside>
      </div>

      {/* Category sections */}
      {byCategory?.map((category) =>
        category.articles.length > 0 ? (
          <section key={category.name} className="container">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-extrabold">{category.name}</h2>
              <Link href={`/category/${category.slug}`} className="text-sm font-semibold text-primary hover:underline">
                Barchasi →
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {category.articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          </section>
        ) : null
      )}
    </main>
  );
}
