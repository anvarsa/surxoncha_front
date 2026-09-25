import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const STRAPI_URL = (process.env.NEXT_PUBLIC_STRAPI_URL || "").replace(/\/+$/, "");

/** Strapi nisbiy media URL'ini (masalan "/uploads/x.jpg") to'liq URL'ga aylantiradi. */
export function mediaUrl(url?: string | null): string {
  if (!url) return "/placeholder-cover.svg";
  return url.startsWith("http") ? url : `${STRAPI_URL}/${url.replace(/^\/+/, "")}`;
}

export function formatDate(dateString?: string): string {
  if (!dateString) return "";
  return new Intl.DateTimeFormat("uz-Latn", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(dateString));
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return "";
  const diffMs = Date.now() - new Date(dateString).getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "hozirgina";
  if (diffMin < 60) return `${diffMin} daqiqa oldin`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} soat oldin`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 7) return `${diffDay} kun oldin`;
  return formatDate(dateString);
}

const CATEGORY_LABELS: Record<string, string> = {
  news: "Yangilik",
  interview: "Intervyu",
  reportage: "Reportaj",
  business: "Biznes",
  youth: "Yoshlar",
};

export function contentTypeLabel(type?: string) {
  return type ? CATEGORY_LABELS[type] ?? type : "";
}
