import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <header className="py-6 text-center">
        <Link href="/" className="text-xl font-extrabold tracking-tight text-primary">
          SURXONCHA<span className="text-secondary">.UZ</span>
        </Link>
      </header>
      <main className="flex-1 flex items-start justify-center px-4 pb-16">
        <div className="w-full max-w-md bg-surface border border-border rounded-lg p-6 sm:p-8 shadow-sm">
          {children}
        </div>
      </main>
    </div>
  );
}
