import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getSession, canSubmitArticles } from "@/lib/auth/session";
import { getMyArticles, getMyApplication } from "@/lib/api/dashboard";
import { DashboardArticleRow } from "@/components/dashboard/DashboardArticleRow";
import { StatCard } from "@/components/dashboard/StatCard";
import { EmptyState } from "@/components/common/EmptyState";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = { title: "Dashboard | SURXONCHA.UZ", ...noIndexMetadata };

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;
  const { user } = session;

  if (!canSubmitArticles(user.role)) {
    return <RegisteredUserView jwt={session.strapiJwt} />;
  }

  const { data: articles } = await getMyArticles(session.strapiJwt, user.id);

  const counts = articles.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Mening maqolalarim</h1>
        <Link
          href="/submit"
          className="flex items-center gap-1.5 rounded bg-primary text-white text-sm font-semibold px-4 py-2 hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" /> Yangi maqola
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Jami" value={articles.length} />
        <StatCard label="Nashr qilingan" value={counts.published ?? 0} />
        <StatCard label="Tekshiruvda" value={(counts.submitted ?? 0) + (counts.in_review ?? 0)} />
        <StatCard label="Qayta ko'rib chiqish" value={counts.revision_requested ?? 0} />
      </div>

      <div className="bg-surface border border-border rounded-lg px-5">
        {articles.length > 0 ? (
          articles.map((a) => <DashboardArticleRow key={a.id} article={a} />)
        ) : (
          <div className="py-4">
            <EmptyState
              title="Hali maqola yubormagansiz."
              hint="Yuqoridagi 'Yangi maqola' tugmasi orqali boshlang."
            />
          </div>
        )}
      </div>
    </div>
  );
}

async function RegisteredUserView({ jwt }: { jwt: string }) {
  const application = await getMyApplication(jwt);

  return (
    <div className="max-w-lg mx-auto text-center py-10">
      {!application && (
        <>
          <h1 className="text-xl font-bold mb-2">Hali Contributor emassiz</h1>
          <p className="text-sm text-muted mb-6">
            Maqola yuborish uchun avval jamoaga qo'shilish arizasini topshiring.
          </p>
          <Link
            href="/join"
            className="inline-block rounded bg-primary text-white font-semibold px-5 py-2.5 text-sm hover:opacity-90"
          >
            Jamoaga qo'shilish arizasi
          </Link>
        </>
      )}

      {application?.status === "pending" && (
        <>
          <h1 className="text-xl font-bold mb-2">Arizangiz ko'rib chiqilmoqda</h1>
          <p className="text-sm text-muted">
            Tahririyat arizangizni tekshiryapti. Tasdiqlangach, shu yerda maqola
            yubora olasiz.
          </p>
        </>
      )}

      {application?.status === "rejected" && (
        <>
          <h1 className="text-xl font-bold mb-2">Ariza rad etilgan</h1>
          {application.reviewNote && (
            <p className="text-sm text-muted mb-4">{application.reviewNote}</p>
          )}
          <Link href="/join" className="text-primary font-semibold hover:underline">
            Qaytadan ariza topshirish →
          </Link>
        </>
      )}
    </div>
  );
}
