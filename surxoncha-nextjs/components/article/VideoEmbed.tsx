function toEmbedUrl(url: string): string | null {
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  return null;
}

export function VideoEmbed({ url }: { url: string }) {
  const embedUrl = toEmbedUrl(url);

  if (!embedUrl) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-sm">
        Videoni ko'rish
      </a>
    );
  }

  return (
    <div className="my-8 aspect-video rounded overflow-hidden bg-black">
      <iframe
        src={embedUrl}
        title="Video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  );
}
