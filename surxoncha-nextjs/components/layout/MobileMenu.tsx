"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MAIN_NAV } from "@/config/nav";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menyuni ochish"
        aria-expanded={open}
        className="md:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-text transition hover:bg-bg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Mobil menyu">
          <button
            type="button"
            aria-label="Menyuni yopish"
            className="absolute inset-0 h-full w-full cursor-default bg-black/45"
            onClick={() => setOpen(false)}
          />
          <nav className="relative h-full w-[min(21rem,calc(100vw-2rem))] overflow-y-auto bg-surface px-5 pb-8 pt-5 shadow-2xl">
            <div className="mb-7 flex items-center justify-between">
              <span className="font-extrabold tracking-tight text-primary">
                SURXONCHA<span className="text-secondary">.UZ</span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Menyuni yopish"
                className="inline-flex h-10 w-10 items-center justify-center rounded-lg transition hover:bg-bg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="space-y-1">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg border-b border-border/60 px-3 py-3 text-[15px] font-medium transition hover:bg-bg hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/submit"
              onClick={() => setOpen(false)}
              className="mt-7 block rounded-lg bg-primary px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:opacity-90"
            >
              Xabar yuborish
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
