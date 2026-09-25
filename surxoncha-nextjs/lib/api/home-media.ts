import { strapiFetch, toQueryString } from "./client";
import type { Article, HomePhoto, HomeVideo, PaginatedResult } from "@/types/content";

const PHOTOS_TAG = "home-photos";
const VIDEOS_TAG = "home-videos";

export async function getHomePhotos(limit = 12) {
  const qs = toQueryString({
    filters: { isStory: { $eq: true } },
    sort: ["publishedAt:desc", "createdAt:desc"],
    pagination: { page: 1, pageSize: limit },
    populate: { image: true },
  });
  return strapiFetch<PaginatedResult<HomePhoto>>(`/photos?${qs}`, {
    next: { revalidate: 60, tags: [PHOTOS_TAG] },
  });
}

export async function getHomeVideos(limit = 6) {
  const qs = toQueryString({
    sort: ["publishedAt:desc", "createdAt:desc"],
    pagination: { page: 1, pageSize: limit },
    populate: { thumbnail: true, videoFile: true },
  });

  const result = await strapiFetch<PaginatedResult<HomeVideo>>(`/videos?${qs}`, {
    next: { revalidate: 60, tags: [VIDEOS_TAG] },
  });

  if (result.data.length > 0) return result;

  const articleQs = toQueryString({
    filters: {
      status: { $eq: "published" },
      videoUrl: { $notNull: true },
    },
    sort: ["publishedAt:desc", "createdAt:desc"],
    pagination: { page: 1, pageSize: limit },
    populate: { coverImage: true, category: true, author: true },
  });

  const articleResult = await strapiFetch<PaginatedResult<Article>>(`/articles?${articleQs}`, {
    next: { revalidate: 60, tags: ["articles"] },
  });

  return {
    data: articleResult.data
      .filter((article) => !!article.videoUrl)
      .map((article) => ({
        id: article.id,
        title: article.title,
        slug: article.slug,
        description: article.excerpt || article.content.replace(/<[^>]*>/g, "").slice(0, 180),
        platform: article.videoUrl?.includes("youtube") ? "youtube" : "upload",
        sourceUrl: article.videoUrl || "",
        thumbnail: article.coverImage,
        featured: article.featured,
        publishedAt: article.publishedAt,
        createdAt: article.createdAt,
      })),
    pagination: articleResult.pagination,
  } satisfies PaginatedResult<HomeVideo>;
}
