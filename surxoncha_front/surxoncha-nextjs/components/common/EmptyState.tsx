export function EmptyState({
  title = "Bu bo'limda hozircha maqolalar mavjud emas.",
  hint,
}: {
  title?: string;
  hint?: string;
}) {
  return (
    <div className="border border-dashed border-border rounded-lg py-14 text-center">
      <p className="text-muted text-sm">{title}</p>
      {hint && <p className="text-muted text-xs mt-1">{hint}</p>}
    </div>
  );
}
