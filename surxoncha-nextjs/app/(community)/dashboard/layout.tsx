import Link from "next/link";
import { requireUser, isEditor } from "@/lib/auth/session";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const editor = isEditor(user.role);

  return (
    <div className="min-h-screen bg-bg">
      <div className="border-b border-border bg-surface">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="text-lg font-extrabold text-primary">
            SURXONCHA<span className="text-secondary">.UZ</span>
          </Link>
          <span className="text-sm text-muted">
            Salom, <span className="font-medium text-text">{user.displayName}</span>
          </span>
        </div>
        <div className="container flex items-center gap-1 overflow-x-auto pb-px">
          <NavTab href="/dashboard" label="Mening maqolalarim" />
          {editor && <NavTab href="/dashboard/editor" label="Editorial Queue" />}
          {editor && <NavTab href="/dashboard/editor/applications" label="Arizalar" />}
        </div>
      </div>
      <div className="container py-8">{children}</div>
    </div>
  );
}

function NavTab({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="shrink-0 px-3.5 py-2.5 text-sm font-medium text-muted hover:text-text border-b-2 border-transparent hover:border-primary/40 transition"
    >
      {label}
    </Link>
  );
}
