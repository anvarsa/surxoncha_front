import Image from "next/image";
import type { GalleryImage } from "@/types/content";
import { mediaUrl } from "@/lib/utils";

export function PhotoGallery({ gallery }: { gallery: GalleryImage[] }) {
  if (!gallery || gallery.length === 0) return null;

  return (
    <div className="my-8 grid sm:grid-cols-2 gap-3">
      {gallery.map((item) => (
        <figure key={item.id} className="space-y-1.5">
          <div className="relative aspect-[4/3] rounded overflow-hidden bg-border">
            <Image
              src={mediaUrl(item.image.url)}
              alt={item.caption || item.image.alternativeText || ""}
              fill
              className="object-cover"
              sizes="(min-width: 640px) 50vw, 100vw"
            />
          </div>
          {item.caption && (
            <figcaption className="text-xs text-muted">{item.caption}</figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
