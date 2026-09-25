import { requireEditor, getSession } from "@/lib/auth/session";
import { getEditorialQueue, getArticleCountsByStatus } from "@/lib/api/dashboard";
import { EditorialQueueRow } from "@/components/dashboard/EditorialQueueRow";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = { title: "Editorial Queue | SURXONCHA.UZ", ...noIndexMetadata };

export default async function EditorQueuePage() {
  await requireEditor();
  const session = await getSession();
  if (!session) return null;

  const [{ data: queue }, counts] = await Promise.all([
    getEditorialQueue(session.strapiJwt),
    getArticleCountsByStatus(session.strapiJwt),
  ]);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Editorial Queue</h1>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
        <StatCard label="Tekshiruvda" value={queue.length} />
        <StatCard label="Bugun yuborilgan" value={counts.submitted} />
        <StatCard label="Tasdiqlangan" value={counts.approved} />
        <StatCard label="Nashr qilingan" value={counts.published} />
        <StatCard label="Rad etilgan" value={counts.rejected} />
      </div>

      <div className="bg-surface border border-border rounded-lg px-5">
        {queue.length > 0 ? (
          queue.map((article) => <EditorialQueueRow key={article.id} article={article} />)
        ) : (
          <div className="py-4">
            <EmptyState title="Hozircha tekshiruv kutayotgan maqola yo'q." />
          </div>
        )}
      </div>
    </div>
  );
}
