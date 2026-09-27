export default function HomeLoading() {
  return (
    <div className="container py-8 space-y-16 animate-pulse">
      <div className="grid md:grid-cols-2 gap-6 md:gap-10">
        <div className="aspect-[4/3] rounded bg-border" />
        <div className="space-y-4 py-4">
          <div className="h-4 w-20 bg-border rounded" />
          <div className="h-10 w-full bg-border rounded" />
          <div className="h-10 w-3/4 bg-border rounded" />
          <div className="h-4 w-full bg-border rounded" />
          <div className="h-4 w-2/3 bg-border rounded" />
        </div>
      </div>

      <div>
        <div className="h-6 w-40 bg-border rounded mb-5" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[16/10] bg-border rounded" />
              <div className="h-3 w-16 bg-border rounded" />
              <div className="h-4 w-full bg-border rounded" />
              <div className="h-4 w-2/3 bg-border rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
