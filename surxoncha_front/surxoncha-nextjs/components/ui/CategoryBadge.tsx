import Link from "next/link";

export function CategoryBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link href={`/category/${slug}`} className="category-pill hover:opacity-90">
      {name}
    </Link>
  );
}
