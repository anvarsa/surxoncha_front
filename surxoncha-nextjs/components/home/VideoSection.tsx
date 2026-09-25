"use client";

import Image from "next/image";
import { useState } from "react";
import type { HomeVideo } from "@/types/content";
import { mediaUrl } from "@/lib/utils";
import { SectionHeader } from "./SectionHeader";

function youtubeEmbed(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : null;
}

export function VideoSection({ videos }: { videos: HomeVideo[] }) {
  const [playing, setPlaying] = useState<number | null>(null);
  if (videos.length === 0) return null;

  return (
    <section>
      <SectionHeader title="Video" />
      <div className="grid gap-5 sm:grid-cols-2">
        {videos.slice(0, 4).map((video) => {
          const embedUrl = youtubeEmbed(video.sourceUrl);
          const videoUrl = video.videoFile?.url ? mediaUrl(video.videoFile.url) : null;
          const canPlay = Boolean(embedUrl || videoUrl);
          return (
            <article key={video.id} className="overflow-hidden rounded border border-border bg-surface">
              <div className="relative aspect-video bg-black">
                {playing === video.id && embedUrl ? (
                  <iframe src={embedUrl} title={video.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen className="h-full w-full" />
                ) : playing === video.id && videoUrl ? (
                  <video src={videoUrl} controls autoPlay className="h-full w-full" />
                ) : video.thumbnail?.url ? (
                  <button type="button" onClick={() => canPlay && setPlaying(video.id)} className="group relative h-full w-full" aria-label={`${video.title} videosini ijro etish`}>
                    <Image src={mediaUrl(video.thumbnail.url)} alt={video.title} fill sizes="(min-width: 640px) 50vw, 100vw" className="object-cover transition group-hover:scale-105" />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25 text-4xl text-white">▶</span>
                  </button>
                ) : (
                  <button type="button" onClick={() => canPlay && setPlaying(video.id)} className="flex h-full w-full items-center justify-center text-4xl text-white" aria-label={`${video.title} videosini ijro etish`}>▶</button>
                )}
              </div>
              <div className="p-3">
                <h3 className="font-bold">{video.title}</h3>
                {video.description && <p className="mt-1 line-clamp-2 text-sm text-muted">{video.description}</p>}
                {!embedUrl && !videoUrl && video.sourceUrl && <a href={video.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs font-semibold text-primary underline">Manbani ochish</a>}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
