// Barcha Strapi so'rovlari shu fayl orqali o'tadi.
// Komponentlarda to'g'ridan-to'g'ri fetch() ishlatmang — /lib/api/*.ts dan foydalaning.

const STRAPI_URL = (
  process.env.STRAPI_URL || "https://surxonchafront-production-7610.up.railway.app"
).replace(/\/+$/, "");
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

interface FetchOptions extends RequestInit {
  // Next.js fetch cache/revalidate options
  next?: { revalidate?: number | false; tags?: string[] };
  /** Only pass true for requests that require the write-scoped server token
   *  (submitting articles, editorial actions). Never expose this token to the client. */
  authenticated?: boolean;
}

export async function strapiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const { authenticated, headers, ...rest } = options;

  const res = await fetch(`${STRAPI_URL}/api${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(authenticated && STRAPI_API_TOKEN
        ? { Authorization: `Bearer ${STRAPI_API_TOKEN}` }
        : {}),
      ...headers,
    },
    // Default: cache public content for 60s, override per-call via `next`.
    next: rest.next ?? { revalidate: 60 },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(
      `Strapi request failed: ${res.status} ${path} ${body}`,
      res.status
    );
  }

  const json = await res.json();
  if (json?.meta?.pagination && json.pagination === undefined) {
    json.pagination = json.meta.pagination;
  }
  return json as T;
}

/** Builds a Strapi v4/v5 qs-style query string from a plain params object. */
export function toQueryString(params: Record<string, unknown>): string {
  const search = new URLSearchParams();
  const walk = (obj: Record<string, unknown>, prefix: string) => {
    for (const [key, value] of Object.entries(obj)) {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      if (value === undefined || value === null) continue;
      if (Array.isArray(value)) {
        value.forEach((v, i) => {
          const itemKey = `${fullKey}[${i}]`;
          if (v && typeof v === "object") {
            walk(v as Record<string, unknown>, itemKey);
          } else if (v !== undefined && v !== null) {
            search.append(itemKey, String(v));
          }
        });
      } else if (typeof value === "object") {
        walk(value as Record<string, unknown>, fullKey);
      } else {
        search.append(fullKey, String(value));
      }
    }
  };
  walk(params, "");
  return search.toString();
}
