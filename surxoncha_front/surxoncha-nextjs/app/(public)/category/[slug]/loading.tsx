export default function CategoryLoading() {
  return (
    <div className="container py-8 animate-pulse">
      <div className="h-3 w-40 bg-border rounded mb-4" />
      <div className="h-8 w-64 bg-border rounded mb-2" />
      <div className="h-4 w-96 max-w-full bg-border rounded mb-8" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[16/10] bg-border rounded" />
            <div className="h-3 w-16 bg-border rounded" />
            <div className="h-4 w-full bg-border rounded" />
            <div className="h-4 w-2/3 bg-border rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
