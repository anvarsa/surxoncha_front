import type { Metadata } from "next";
import Link from "next/link";
import {
  getFeaturedArticle,
  getLatestArticles,
  getArticlesByContentType,
  getPopularArticles,
} from "@/lib/api/articles";
import { getAllRegions } from "@/lib/api/regions";
import { getHomePhotos, getHomeVideos } from "@/lib/api/home-media";
import { HeroArticle } from "@/components/article/HeroArticle";
import { ArticleCard } from "@/components/article/ArticleCard";
import { RegionCard } from "@/components/region/RegionCard";
import { SectionHeader } from "@/components/home/SectionHeader";
import { CommunityCTA } from "@/components/home/CommunityCTA";
import { EmptyState } from "@/components/common/EmptyState";
import { StoryStrip } from "@/components/home/StoryStrip";
import { HomeSidebar } from "@/components/home/HomeSidebar";
import { PhotoSection } from "@/components/home/PhotoSection";
import { VideoSection } from "@/components/home/VideoSection";

export const metadata: Metadata = {
  title: "SURXONCHA.UZ — Surxondaryoni uning o'z yoshlari hikoya qiladi",
};

export const revalidate = 60;

export default async function HomePage() {
  const [hero, latest, regions, interviews, reportages, business, youth, popular, photos, videos] =
    await Promise.all([
      getFeaturedArticle().catch(() => null),
      getLatestArticles(1, 8).catch(() => ({ data: [], pagination: null })),
      getAllRegions().catch(() => ({ data: [] })),
      getArticlesByContentType("interview", 3).catch(() => ({ data: [] })),
      getArticlesByContentType("reportage", 3).catch(() => ({ data: [] })),
      getArticlesByContentType("business", 3).catch(() => ({ data: [] })),
      getArticlesByContentType("youth", 3).catch(() => ({ data: [] })),
      getPopularArticles(5).catch(() => ({ data: [] })),
      getHomePhotos(12).catch(() => ({ data: [] })),
      getHomeVideos(6).catch(() => ({ data: [] })),
    ]);

  return (
    <div className="container space-y-10 py-6 md:py-8">
      <StoryStrip photos={photos.data} />

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-8">
        <div className="min-w-0 space-y-16">
          {/* HERO */}
          {hero ? (
            <HeroArticle article={hero} />
          ) : (
            <EmptyState title="Hozircha tavsiya etilgan maqola yo'q." />
          )}

          {/* LATEST NEWS */}
          <section>
            <SectionHeader title="So'nggi yangiliklar" href="/category/yangiliklar" />
            {latest.data.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {latest.data.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>

          {/* REGIONAL NEWS */}
          <section>
            <SectionHeader title="Hududlardan" href="/regions" />
            {regions.data.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {regions.data.slice(0, 8).map((r) => (
                  <RegionCard key={r.slug} region={r} />
                ))}
              </div>
            ) : (
              <EmptyState title="Hududlar ro'yxati topilmadi." />
            )}
          </section>

          {/* INTERVIEW */}
          <ContentTypeSection title="Suhbat" href="/category/intervyu" articles={interviews.data} />

          {/* REPORTAGE */}
          <ContentTypeSection title="Reportaj" href="/category/reportaj" articles={reportages.data} />

          {/* BUSINESS */}
          <ContentTypeSection title="Biznes" href="/category/biznes" articles={business.data} />

          {/* YOUTH */}
          <ContentTypeSection title="Yoshlar" href="/category/yoshlar" articles={youth.data} />

          <VideoSection videos={videos.data} />
          <PhotoSection photos={photos.data} />

          {/* POPULAR */}
          {popular.data.length > 0 && (
            <section>
              <SectionHeader title="Ko'p o'qilgan maqolalar" />
              <div className="space-y-5">
                {popular.data.map((a) => (
                  <ArticleCard key={a.id} article={a} orientation="horizontal" />
                ))}
              </div>
            </section>
          )}

          {/* COMMUNITY CTA */}
          <CommunityCTA />
        </div>

        <HomeSidebar popular={popular.data} latest={latest.data} />
      </div>
    </div>
  );
}

function ContentTypeSection({
  title,
  href,
  articles,
}: {
  title: string;
  href: string;
  articles: Awaited<ReturnType<typeof getArticlesByContentType>>["data"];
}) {
  if (articles.length === 0) return null;
  return (
    <section>
      <SectionHeader title={title} href={href} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}
