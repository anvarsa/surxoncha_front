import Link from "next/link";
import Image from "next/image";
import type { Region } from "@/types/content";
import { mediaUrl } from "@/lib/utils";

export function RegionCard({ region }: { region: Region }) {
  return (
    <Link
      href={`/regions/${region.slug}`}
      className="group relative block aspect-[3/2] overflow-hidden rounded bg-primary"
    >
      {region.coverImage?.url && (
        <Image
          src={mediaUrl(region.coverImage.url)}
          alt={region.name}
          fill
          className="object-cover opacity-70 group-hover:opacity-55 transition"
          sizes="(min-width: 1024px) 25vw, 50vw"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <span className="absolute bottom-3 left-3 text-white font-bold text-sm sm:text-base">
        {region.name}
      </span>
    </Link>
  );
}
