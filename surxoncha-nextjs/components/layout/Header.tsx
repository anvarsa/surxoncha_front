import Link from "next/link";
import { MAIN_NAV } from "@/config/nav";
import { getSession } from "@/lib/auth/session";
import { SearchBox } from "@/components/search/SearchBox";
import { AccountMenu } from "./AccountMenu";
import { MobileMenu } from "./MobileMenu";
import { BreakingNewsBar } from "./BreakingNewsBar";

const TODAY = new Intl.DateTimeFormat("uz-Latn", {
  weekday: "long",
  day: "numeric",
  month: "long",
}).format(new Date());

export async function Header() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-40 bg-surface/95 backdrop-blur border-b border-border">
      {/* Top utility bar */}
      <div className="hidden md:block border-b border-border/70 bg-bg">
        <div className="container flex items-center justify-between py-1.5 text-xs text-muted">
          <span>Surxondaryo viloyati</span>
          <span className="capitalize">{TODAY}</span>
        </div>
      </div>

      {/* Main header */}
      <div className="container flex items-center justify-between py-3 gap-4">
        <div className="flex items-center gap-2">
          <MobileMenu />
          <Link href="/" className="text-xl font-extrabold tracking-tight text-primary shrink-0">
            SURXONCHA<span className="text-secondary">.UZ</span>
          </Link>
        </div>

        <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
          {MAIN_NAV.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary transition">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block">
            <SearchBox />
          </div>
          <Link
            href="/submit"
            className="hidden sm:inline-flex items-center rounded bg-primary text-white text-sm font-semibold px-4 py-2 hover:opacity-90 transition"
          >
            Xabar yuborish
          </Link>
          <AccountMenu user={session?.user ?? null} />
        </div>
      </div>

      <BreakingNewsBar />
    </header>
  );
}
