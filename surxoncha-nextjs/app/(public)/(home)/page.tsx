import Link from "next/link";
import type { Article } from "@/types/content";
import { getLatestArticles, getPopularArticles, getArticlesByContentType, getFeaturedArticle } from "@/lib/api/articles";
import { HeroArticle } from "@/components/article/HeroArticle";
import { ArticleCard } from "@/components/article/ArticleCard";
import { PopularWithSocial } from "@/components/home/PopularWithSocial";
import { HomeSidebar } from "@/components/home/HomeSidebar";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  try {
    const [heroResult, latestResult, popularResult] = await Promise.all([
      getFeaturedArticle(),
      getLatestArticles(1, 8),
      getPopularArticles(8),
    ]);

    const hero = heroResult;
    const latest = latestResult?.data || [];
    const popular = popularResult?.data || [];

    return (
      <main className="space-y-16">
        {/* Hero article */}
        {hero && <HeroArticle article={hero} />}

        {/* Popular articles with social media */}
        <section className="container">
          <PopularWithSocial articles={popular} />
        </section>

        {/* Main content grid */}
        {latest.length > 0 && (
          <div className="container grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
            {/* Left: Latest articles */}
            <div className="lg:col-span-2">
              <section>
                <h2 className="mb-6 text-2xl font-extrabold">So&apos;nggi yangiliklar</h2>
                <div className="space-y-6">
                  {latest.map((article) => (
                    <ArticleCard key={article.id} article={article} orientation="horizontal" />
                  ))}
                </div>
              </section>
            </div>

            {/* Right: Sidebar */}
            <aside>
              <HomeSidebar popular={popular} latest={latest} />
            </aside>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("Homepage error:", error);
    return (
      <main className="container py-12 text-center">
        <h1 className="text-2xl font-bold text-text">Sahifani yuklashda xatolik</h1>
        <p className="mt-2 text-muted">Iltimos, keyinroq qayta urinib ko'ring.</p>
      </main>
    );
  }
}
