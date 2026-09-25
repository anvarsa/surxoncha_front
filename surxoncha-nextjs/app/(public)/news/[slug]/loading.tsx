export default function ArticleLoading() {
  return (
    <div className="container py-8 animate-pulse">
      <div className="max-w-article mx-auto space-y-4">
        <div className="h-3 w-1/3 bg-border rounded" />
        <div className="h-3 w-20 bg-border rounded" />
        <div className="h-10 w-full bg-border rounded" />
        <div className="h-10 w-2/3 bg-border rounded" />
        <div className="h-5 w-full bg-border rounded" />
        <div className="h-10 w-full bg-border rounded mb-4" />
        <div className="aspect-[16/9] bg-border rounded-lg" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-4 w-full bg-border rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}
