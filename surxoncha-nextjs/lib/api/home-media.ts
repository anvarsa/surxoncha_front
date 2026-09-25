import { strapiFetch, toQueryString } from "./client";
import type { HomePhoto, HomeVideo, PaginatedResult } from "@/types/content";

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
  return strapiFetch<PaginatedResult<HomeVideo>>(`/videos?${qs}`, {
    next: { revalidate: 60, tags: [VIDEOS_TAG] },
  });
}
