import Link from "next/link";
import { getBreakingArticles } from "@/lib/api/articles";

export async function BreakingNewsBar() {
  let items: { title: string; slug: string }[] = [];
  try {
    const result = await getBreakingArticles();
    items = result.data;
  } catch {
    return null; // Strapi vaqtincha ishlamasa, breaking bar shunchaki ko'rinmaydi
  }

  if (items.length === 0) return null;

  return (
    <div className="bg-breaking text-white">
      <div className="container flex items-center gap-3 py-2 overflow-x-auto scrollbar-none">
        <span className="shrink-0 text-xs font-extrabold uppercase tracking-wide bg-white/15 rounded px-2 py-1">
          So'nggi yangiliklar
        </span>
        <div className="flex items-center gap-6 whitespace-nowrap text-sm">
          {items.map((item) => (
            <Link key={item.slug} href={`/news/${item.slug}`} className="hover:underline shrink-0">
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
