import { strapiFetch, toQueryString } from "./client";
import type { Article, AuthorProfile, Category, Region, PaginatedResult } from "@/types/content";

export interface SearchResults {
  articles: PaginatedResult<Article>;
  authors: AuthorProfile[];
  categories: Category[];
  regions: Region[];
}

export async function search(query: string, page = 1, pageSize = 10): Promise<SearchResults> {
  if (!query.trim()) {
    return {
      articles: { data: [], pagination: { page: 1, pageSize, pageCount: 0, total: 0 } },
      authors: [],
      categories: [],
      regions: [],
    };
  }

  const articleQs = toQueryString({
    filters: {
      status: { $eq: "published" },
      $or: [
        { title: { $containsi: query } },
        { excerpt: { $containsi: query } },
        { content: { $containsi: query } },
      ],
    },
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize },
    populate: { coverImage: true, category: true, region: true, author: true },
  });

  const authorQs = toQueryString({
    filters: { displayName: { $containsi: query } },
    pagination: { pageSize: 5 },
    populate: { avatar: true },
  });

  const categoryQs = toQueryString({
    filters: { name: { $containsi: query } },
    pagination: { pageSize: 5 },
  });

  const regionQs = toQueryString({
    filters: { name: { $containsi: query } },
    pagination: { pageSize: 5 },
  });

  const [articles, authors, categories, regions] = await Promise.all([
    strapiFetch<PaginatedResult<Article>>(`/articles?${articleQs}`),
    strapiFetch<{ data: AuthorProfile[] }>(`/author-profiles?${authorQs}`),
    strapiFetch<{ data: Category[] }>(`/categories?${categoryQs}`),
    strapiFetch<{ data: Region[] }>(`/regions?${regionQs}`),
  ]);

  return { articles, authors: authors.data, categories: categories.data, regions: regions.data };
}
