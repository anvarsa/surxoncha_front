import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({
  basePath,
  currentPage,
  pageCount,
  extraParams,
}: {
  basePath: string;
  currentPage: number;
  pageCount: number;
  extraParams?: Record<string, string>;
}) {
  if (pageCount <= 1) return null;

  const prev = Math.max(1, currentPage - 1);
  const next = Math.min(pageCount, currentPage + 1);
  const extra = extraParams
    ? "&" + new URLSearchParams(extraParams).toString()
    : "";

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Sahifalash">
      <Link
        href={`${basePath}?page=${prev}${extra}`}
        aria-disabled={currentPage === 1}
        className={`flex items-center gap-1 rounded border border-border px-3 py-2 text-sm ${
          currentPage === 1 ? "pointer-events-none opacity-40" : "hover:border-primary"
        }`}
      >
        <ChevronLeft className="h-4 w-4" /> Oldingi
      </Link>
      <span className="text-sm text-muted px-2">
        {currentPage} / {pageCount}
      </span>
      <Link
        href={`${basePath}?page=${next}${extra}`}
        aria-disabled={currentPage === pageCount}
        className={`flex items-center gap-1 rounded border border-border px-3 py-2 text-sm ${
          currentPage === pageCount ? "pointer-events-none opacity-40" : "hover:border-primary"
        }`}
      >
        Keyingi <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
