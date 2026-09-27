import { requireEditor, getSession } from "@/lib/auth/session";
import { getPendingApplications } from "@/lib/api/dashboard";
import { ApplicationRow } from "@/components/dashboard/ApplicationRow";
import { EmptyState } from "@/components/common/EmptyState";
import { noIndexMetadata } from "@/lib/seo/metadata";

export const metadata = { title: "Contributor arizalari | SURXONCHA.UZ", ...noIndexMetadata };

export default async function ApplicationsPage() {
  await requireEditor();
  const session = await getSession();
  if (!session) return null;

  const { data: applications } = await getPendingApplications(session.strapiJwt);

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">Jamoaga qo'shilish arizalari</h1>
      <p className="text-sm text-muted mb-6">
        Tasdiqlansa, arizachi avtomatik ravishda Contributor bo'ladi va{" "}
        <code className="text-xs">/submit</code> orqali maqola yubora oladi.
      </p>

      <div className="bg-surface border border-border rounded-lg px-5">
        {applications.length > 0 ? (
          applications.map((app) => <ApplicationRow key={app.id} application={app} />)
        ) : (
          <div className="py-4">
            <EmptyState title="Ko'rib chiqilmagan arizalar yo'q." />
          </div>
        )}
      </div>
    </div>
  );
}
