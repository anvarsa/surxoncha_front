import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getRegionBySlug } from "@/lib/api/regions";
import { getArticlesByRegion } from "@/lib/api/articles";
import { buildRegionMetadata } from "@/lib/seo/metadata";
import { mediaUrl } from "@/lib/utils";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { Breadcrumb } from "@/components/common/Breadcrumb";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const region = await getRegionBySlug(slug);
  if (!region) return { title: "Hudud topilmadi | SURXONCHA.UZ" };
  return buildRegionMetadata(region);
}

export const revalidate = 300;

export default async function RegionPage({ params, searchParams }: Props) {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const region = await getRegionBySlug(slug);
  if (!region) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const result = await getArticlesByRegion(slug, page, 12).catch(() => ({
    data: [],
    pagination: { page: 1, pageSize: 12, pageCount: 1, total: 0 },
  }));
  const articles = result.data;
  const pagination = result.pagination ?? { page: 1, pageSize: 12, pageCount: 1, total: 0 };

  return (
    <div>
      {region.coverImage?.url && (
        <div className="relative h-48 sm:h-64 bg-primary">
          <Image src={mediaUrl(region.coverImage.url)} alt={region.name} fill className="object-cover opacity-60" />
        </div>
      )}
      <div className="container py-8">
        <Breadcrumb items={[{ name: "Bosh sahifa", href: "/" }, { name: "Hududlar", href: "/regions" }, { name: region.name }]} />
        <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-1">{region.name}</h1>
        {region.description && <p className="text-muted mb-8 max-w-2xl">{region.description}</p>}

        {articles.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
            <Pagination
              basePath={`/regions/${slug}`}
              currentPage={pagination.page}
              pageCount={pagination.pageCount}
            />
          </>
        ) : (
          <EmptyState title={`${region.name} bo'yicha hozircha maqolalar mavjud emas.`} />
        )}
      </div>
    </div>
  );
}
