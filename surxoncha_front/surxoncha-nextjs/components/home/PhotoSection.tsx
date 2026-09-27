"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomePhoto } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

export function PhotoSection({ photos }: { photos: HomePhoto[] }) {
  const [activePhoto, setActivePhoto] = useState<HomePhoto | null>(null);
  if (photos.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Foto lavhalar" />
      <div className="grid gap-3 sm:grid-cols-3">
        {photos.slice(0, 6).map((photo) => (
          <button key={photo.id} type="button" onClick={() => setActivePhoto(photo)} className="group text-left">
            <div className="relative aspect-[4/3] overflow-hidden rounded bg-border">
              <Image src={mediaUrl(photo.image?.url)} alt={photo.title} fill sizes="(min-width: 640px) 33vw, 100vw" className="object-cover transition group-hover:scale-105" />
            </div>
            <h3 className="mt-2 line-clamp-2 text-sm font-bold group-hover:text-primary">{photo.title}</h3>
            {photo.description && <p className="mt-1 line-clamp-2 text-xs text-muted">{photo.description}</p>}
          </button>
        ))}
      </div>
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label={activePhoto.title}>
          <button type="button" onClick={() => setActivePhoto(null)} className="absolute right-4 top-4 text-3xl text-white" aria-label="Fotoni yopish">×</button>
          <figure className="max-w-4xl">
            <div className="relative max-h-[78vh] min-h-[240px] w-[min(90vw,960px)] overflow-hidden rounded-xl bg-black">
              <Image src={mediaUrl(activePhoto.image?.url)} alt={activePhoto.title} width={activePhoto.image.width || 1200} height={activePhoto.image.height || 900} className="max-h-[78vh] w-full object-contain" priority />
            </div>
            <figcaption className="mt-3 text-center text-white">
              <h3 className="font-bold">{activePhoto.title}</h3>
              {activePhoto.description && <p className="mt-1 text-sm text-white/75">{activePhoto.description}</p>}
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
