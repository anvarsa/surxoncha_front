import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function SectionHeader({ title, href }: { title: string; href?: string }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2 className="text-h3-mobile md:text-h3-desktop font-extrabold">{title}</h2>
      {href && (
        <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-primary hover:gap-1.5 transition-all">
          Barchasi <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}
