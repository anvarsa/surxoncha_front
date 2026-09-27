import { strapiFetch, toQueryString } from "./client";
import type { Article, PaginatedResult } from "@/types/content";

const ARTICLE_POPULATE = {
  populate: {
    coverImage: true,
    gallery: { populate: ["image"] },
    category: true,
    region: true,
    author: { populate: ["avatar"] },
    tags: true,
    seo: { populate: ["ogImage"] },
    corrections: { populate: ["editor"] },
  },
};

/**
 * Kesh teglari strategiyasi (7-qism):
 * - "articles" — har qanday maqola ro'yxati (bosh sahifa, kategoriya, hudud...)
 *   shu tegga bog'lanadi. Har qanday maqola publish/update/delete bo'lganda
 *   `/api/revalidate` shu tegni invalidatsiya qiladi — barcha ro'yxatlar
 *   keyingi so'rovda yangilanadi.
 * - "article:{slug}" — bitta maqola sahifasi uchun aniq teg, faqat o'sha
 *   maqola o'zgarganda revalidate qilinadi (boshqalarga tegmaydi).
 */
const ARTICLES_LIST_TAG = "articles";
const articleTag = (slug: string) => `article:${slug}`;

export async function getLatestArticles(page = 1, pageSize = 12) {
  const qs = toQueryString({
    filters: { status: { $eq: "published" } },
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize },
    ...ARTICLE_POPULATE,
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: [ARTICLES_LIST_TAG] },
  });
}

export async function getArticleBySlug(slug: string) {
  const qs = toQueryString({
    filters: { slug: { $eq: slug }, status: { $eq: "published" } },
    ...ARTICLE_POPULATE,
  });
  const result = await strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: [ARTICLES_LIST_TAG, articleTag(slug)] },
  });
  return result.data[0] ?? null;
}

export async function getFeaturedArticle() {
  const qs = toQueryString({
    filters: { featured: { $eq: true }, status: { $eq: "published" } },
    sort: ["publishedAt:desc"],
    pagination: { page: 1, pageSize: 1 },
    ...ARTICLE_POPULATE,
  });
  const result = await strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: [ARTICLES_LIST_TAG] },
  });
  return result.data[0] ?? null;
}

export async function getBreakingArticles() {
  const qs = toQueryString({
    filters: { breaking: { $eq: true }, status: { $eq: "published" } },
    sort: ["publishedAt:desc"],
    pagination: { page: 1, pageSize: 8 },
    fields: ["title", "slug"],
  });
  return strapiFetch<PaginatedResult<Pick<Article, "title" | "slug">>>(`/articles?${qs}`, {
    next: { revalidate: 30, tags: [ARTICLES_LIST_TAG] }, // shoshilinch — qisqaroq TTL
  });
}

export async function getArticlesByCategory(
  categorySlug: string,
  page = 1,
  pageSize = 12
) {
  const qs = toQueryString({
    filters: {
      status: { $eq: "published" },
      category: { slug: { $eqi: categorySlug } },
    },
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize },
    ...ARTICLE_POPULATE,
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: [ARTICLES_LIST_TAG] },
  });
}

export async function getArticlesByRegion(
  regionSlug: string,
  page = 1,
  pageSize = 12
) {
  const qs = toQueryString({
    filters: {
      status: { $eq: "published" },
      region: { slug: { $eq: regionSlug } },
    },
    sort: ["publishedAt:desc"],
    pagination: { page, pageSize },
    ...ARTICLE_POPULATE,
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: [ARTICLES_LIST_TAG] },
  });
}

export async function getArticlesByContentType(
  contentType: "news" | "interview" | "reportage" | "business" | "youth",
  limit = 4
) {
  const qs = toQueryString({
    filters: { status: { $eq: "published" }, contentType: { $eq: contentType } },
    sort: ["publishedAt:desc"],
    pagination: { page: 1, pageSize: limit },
    populate: { coverImage: true, category: true, region: true, author: true },
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 60, tags: [ARTICLES_LIST_TAG] },
  });
}

export async function getPopularArticles(limit = 5) {
  const qs = toQueryString({
    filters: { status: { $eq: "published" } },
    sort: ["viewCount:desc"],
    pagination: { page: 1, pageSize: limit },
    populate: { coverImage: true, category: true, author: true },
  });
  // Ko'p o'qilganlar ro'yxati viewCount asosida — bu tez-tez o'zgaradi,
  // shuning uchun revalidate=60 boshqa ro'yxatlar bilan bir xil, lekin
  // ARTICLES_LIST_TAG'ga bog'lanmagan (view increment revalidate chaqirmaydi,
  // faqat vaqt asosida yangilanadi — aks holda har bir o'qish sahifani
  // qayta generatsiya qilib yuborardi).
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 120 },
  });
}

export async function getRelatedArticles(article: Article, limit = 4) {
  const qs = toQueryString({
    filters: {
      status: { $eq: "published" },
      id: { $ne: article.id },
      category: { slug: { $eq: article.category?.slug } },
    },
    sort: ["publishedAt:desc"],
    pagination: { page: 1, pageSize: limit },
    ...ARTICLE_POPULATE,
  });
  const result = await strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 120, tags: [ARTICLES_LIST_TAG] },
  });
  return result.data;
}

/** Sitemap uchun: barcha nashr qilingan maqolalarning slug+updatedAt'ini
 *  sahifalab yig'adi (Strapi bitta so'rovda cheklangan pageSize qaytaradi). */
export async function getAllPublishedArticlesForSitemap() {
  const pageSize = 100;
  let page = 1;
  let pageCount = 1;
  const all: Pick<Article, "slug" | "updatedAt" | "publishedAt">[] = [];

  do {
    const qs = toQueryString({
      filters: { status: { $eq: "published" } },
      fields: ["slug", "updatedAt", "publishedAt"],
      pagination: { page, pageSize },
    });
    const result = await strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
      next: { revalidate: 3600 },
    });
    all.push(...result.data);
    pageCount = result.pagination.pageCount;
    page++;
  } while (page <= pageCount);

  return all;
}

export async function getLatestArticlesForRss(limit = 30) {
  const qs = toQueryString({
    filters: { status: { $eq: "published" } },
    sort: ["publishedAt:desc"],
    pagination: { page: 1, pageSize: limit },
    populate: { author: true, category: true },
  });
  return strapiFetch<PaginatedResult<Article>>(`/articles?${qs}`, {
    next: { revalidate: 300 },
  });
}

/**
 * Contributor draft yaratadi. Server (lifecycles.js) statusni har doim
 * "draft" qilib qo'yadi — client "submitted" yuborsa ham e'tiborga olinmaydi.
 * Foydalanuvchi tayyor bo'lgach, alohida `submitArticle()` chaqiriladi.
 */
export async function createDraftArticle(payload: {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categoryId: number;
  regionId?: number;
  coverImageId: number;
  videoUrl?: string;
  source?: string;
  tagIds?: number[];
  authorId: number;
  contentType?: "news" | "interview" | "reportage" | "business" | "youth";
  readingTime?: number;
}) {
  return strapiFetch<{ data: Article }>(`/articles`, {
    method: "POST",
    authenticated: true,
    body: JSON.stringify({
      data: {
        title: payload.title,
        slug: payload.slug,
        excerpt: payload.excerpt,
        content: payload.content,
        category: payload.categoryId,
        region: payload.regionId,
        coverImage: payload.coverImageId,
        videoUrl: payload.videoUrl,
        source: payload.source,
        tags: payload.tagIds,
        author: payload.authorId,
        contentType: payload.contentType || "news",
        readingTime: payload.readingTime || 1,
      },
    }),
  });
}

/** draft -> submitted. "TAHRIRIYATGA YUBORISH" tugmasi shu funksiyani chaqiradi. */
export async function submitArticle(articleId: number) {
  return strapiFetch<{ data: Article }>(`/articles/${articleId}/submit`, {
    method: "POST",
    authenticated: true,
  });
}

/** Editor actions — barchasi server-side rolga tekshiriladi (lifecycles.js). */
export async function requestRevision(articleId: number, note: string) {
  return strapiFetch<{ data: Article }>(`/articles/${articleId}/request-revision`, {
    method: "POST",
    authenticated: true,
    body: JSON.stringify({ note }),
  });
}

export async function approveArticle(articleId: number) {
  return strapiFetch<{ data: Article }>(`/articles/${articleId}/approve`, {
    method: "POST",
    authenticated: true,
  });
}

export async function rejectArticle(articleId: number, note?: string) {
  return strapiFetch<{ data: Article }>(`/articles/${articleId}/reject`, {
    method: "POST",
    authenticated: true,
    body: JSON.stringify({ note }),
  });
}

export async function publishArticle(articleId: number) {
  return strapiFetch<{ data: Article }>(`/articles/${articleId}/publish`, {
    method: "POST",
    authenticated: true,
  });
}

/** Increment view count — fire-and-forget from the client via a route handler. */
export async function incrementViewCount(articleId: number) {
  return strapiFetch<{ data: Article }>(`/articles/${articleId}/view`, {
    method: "POST",
    authenticated: true,
  });
}
