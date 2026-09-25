import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { search } from "@/lib/api/search";
import { mediaUrl } from "@/lib/utils";
import { SearchInput } from "@/components/search/SearchInput";
import { ArticleCard } from "@/components/article/ArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { EmptyState } from "@/components/common/EmptyState";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = { title: "Qidiruv | SURXONCHA.UZ", ...noIndexMetadata };

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams;
  const query = q ?? "";
  const page = Math.max(1, Number(pageParam) || 1);
  const results = query ? await search(query, page, 12) : null;

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto mb-10">
        <Suspense>
          <SearchInput />
        </Suspense>
      </div>

      {!query && (
        <p className="text-center text-muted">Qidiruv uchun so'z kiriting.</p>
      )}

      {query && results && (
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-muted mb-6">
            <strong className="text-text">{results.articles.pagination.total}</strong> ta natija
            "<strong className="text-text">{query}</strong>" bo'yicha
          </p>

          {(results.authors.length > 0 || results.categories.length > 0 || results.regions.length > 0) && (
            <div className="flex flex-wrap gap-2 mb-8">
              {results.categories.map((c) => (
                <Link key={c.slug} href={`/category/${c.slug}`} className="category-pill">
                  {c.name}
                </Link>
              ))}
              {results.regions.map((r) => (
                <Link
                  key={r.slug}
                  href={`/regions/${r.slug}`}
                  className="text-xs rounded-full border border-border px-3 py-1.5 hover:border-primary transition"
                >
                  {r.name}
                </Link>
              ))}
              {results.authors.map((a) => (
                <Link
                  key={a.username}
                  href={`/authors/${a.username}`}
                  className="flex items-center gap-1.5 text-xs rounded-full border border-border pl-1 pr-3 py-1 hover:border-primary transition"
                >
                  <span className="relative h-5 w-5 rounded-full overflow-hidden bg-border shrink-0">
                    {a.avatar?.url && (
                      <Image src={mediaUrl(a.avatar.url)} alt={a.displayName} fill className="object-cover" />
                    )}
                  </span>
                  {a.displayName}
                </Link>
              ))}
            </div>
          )}

          {results.articles.data.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.articles.data.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
              <Pagination
                basePath="/search"
                currentPage={results.articles.pagination.page}
                pageCount={results.articles.pagination.pageCount}
                extraParams={{ q: query }}
              />
            </>
          ) : (
            <EmptyState title={`"${query}" bo'yicha maqolalar topilmadi.`} />
          )}
        </div>
      )}
    </div>
  );
}
