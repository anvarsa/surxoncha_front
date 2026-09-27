import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/api/categories";
import { getArticlesByCategory } from "@/lib/api/articles";
import { buildCategoryMetadata } from "@/lib/seo/metadata";
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
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategoriya topilmadi | SURXONCHA.UZ" };
  return buildCategoryMetadata(category);
}

export const revalidate = 60;

export default async function CategoryPage({ params, searchParams }: Props) {
  const [{ slug }, { page: pageParam }] = await Promise.all([params, searchParams]);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page = Math.max(1, Number(pageParam) || 1);
  const { data: articles, pagination } = await getArticlesByCategory(slug, page, 12);

  return (
    <div className="container py-8">
      <Breadcrumb items={[{ name: "Bosh sahifa", href: "/" }, { name: category.name }]} />
      <h1 className="text-h2-mobile md:text-h2-desktop font-extrabold mb-1">{category.name}</h1>
      {category.description && <p className="text-muted mb-8 max-w-2xl">{category.description}</p>}

      {articles.length > 0 ? (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
          <Pagination
            basePath={`/category/${slug}`}
            currentPage={pagination.page}
            pageCount={pagination.pageCount}
          />
        </>
      ) : (
        <EmptyState title="Bu bo'limda hozircha maqolalar mavjud emas." />
      )}
    </div>
  );
}
