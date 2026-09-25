"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomePhoto } from "@/types/content";
import { mediaUrl } from "@/lib/utils";

export function StoryStrip({ photos }: { photos: HomePhoto[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  if (photos.length === 0) return null;
  const storyPhotos = photos.slice(0, 12);

  return (
    <>
      <section aria-label="Instagram stories" className="border-b border-border pb-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-primary">IG Story</h2>
          <span className="text-xs text-muted">Rasmlar va qisqa xabarlar</span>
        </div>
        <div className="scrollbar-none flex gap-4 overflow-x-auto pb-1">
          {storyPhotos.map((photo, index) => (
            <button key={photo.id} type="button" onClick={() => setActiveIndex(index)} className="group flex w-16 shrink-0 flex-col items-center gap-1.5 text-left" aria-label={`${photo.title} storysini ochish`}>
              <span className="rounded-full bg-gradient-to-br from-secondary via-primary to-[#B22E35] p-[2px]">
                <span className="block rounded-full bg-surface p-[2px]">
                  <span className="relative block h-12 w-12 overflow-hidden rounded-full bg-border">
                    <Image src={mediaUrl(photo.image?.url)} alt="" fill sizes="48px" className="object-cover transition group-hover:scale-110" />
                  </span>
                </span>
              </span>
              <span className="w-full truncate text-center text-[10px] font-semibold text-text">{photo.title}</span>
            </button>
          ))}
        </div>
      </section>
      {activeIndex !== null && <StoryViewer photos={storyPhotos} index={activeIndex} onClose={() => setActiveIndex(null)} onChange={setActiveIndex} />}
    </>
  );
}

function StoryViewer({ photos, index, onClose, onChange }: { photos: HomePhoto[]; index: number; onClose: () => void; onChange: (index: number) => void }) {
  const photo = photos[index]!;
  const previous = () => onChange(index === 0 ? photos.length - 1 : index - 1);
  const next = () => onChange(index === photos.length - 1 ? 0 : index + 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4" role="dialog" aria-modal="true" aria-label={photo.title}>
      <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 text-3xl leading-none text-white" aria-label="Storyni yopish">×</button>
      <button type="button" onClick={previous} className="absolute left-3 top-1/2 z-10 rounded-full bg-white/15 px-4 py-2 text-2xl text-white" aria-label="Oldingi story">‹</button>
      <figure className="flex max-h-[92vh] w-full max-w-lg flex-col items-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-black">
          <Image src={mediaUrl(photo.image?.url)} alt={photo.title} fill sizes="(max-width: 640px) 100vw, 512px" className="object-contain" priority />
        </div>
        <figcaption className="mt-3 w-full text-center text-white">
          <h3 className="font-bold">{photo.title}</h3>
          {photo.description && <p className="mt-1 text-sm text-white/75">{photo.description}</p>}
        </figcaption>
      </figure>
      <button type="button" onClick={next} className="absolute right-3 top-1/2 z-10 rounded-full bg-white/15 px-4 py-2 text-2xl text-white" aria-label="Keyingi story">›</button>
    </div>
  );
}
