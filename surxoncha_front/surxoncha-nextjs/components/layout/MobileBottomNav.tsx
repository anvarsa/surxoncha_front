"use client";

import Link from "next/link";
import { Home, Search, Send, ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const items = [
  { href: "/", label: "Bosh sahifa", icon: Home },
  { href: "/search", label: "Qidiruv", icon: Search },
  { href: "/submit", label: "Xabar", icon: Send },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowTop(window.scrollY > 420);
    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => window.removeEventListener("scroll", updateVisibility);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <>
      <nav
        aria-label="Mobil navigatsiya"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 pb-[max(0.65rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-4px_18px_rgb(0_0_0_/_0.08)] backdrop-blur md:hidden"
      >
        <div className="mx-auto flex max-w-sm items-center justify-around">
          {items.map(({ href, label, icon: Icon }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex min-w-16 flex-col items-center gap-1 text-[11px] font-semibold transition ${
                  active ? "text-primary" : "text-muted"
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                <span>{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Sahifa tepasiga chiqish"
            className={`flex min-w-16 flex-col items-center gap-1 text-[11px] font-semibold text-muted transition ${
              showTop ? "opacity-100" : "pointer-events-none opacity-35"
            }`}
          >
            <ArrowUp className="h-5 w-5" />
            <span>Tepaga</span>
          </button>
        </div>
      </nav>
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
