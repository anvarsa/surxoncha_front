"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { MAIN_NAV } from "@/config/nav";

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Menyu"
        className="md:hidden p-2 -ml-2"
      >
        <Menu className="h-6 w-6" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <nav className="absolute top-0 left-0 h-full w-72 bg-surface p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="font-extrabold text-primary">SURXONCHA.UZ</span>
              <button onClick={() => setOpen(false)} aria-label="Yopish">
                <X className="h-5 w-5" />
              </button>
            </div>
            <ul className="space-y-1">
              {MAIN_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-[15px] font-medium border-b border-border/60"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/submit"
              onClick={() => setOpen(false)}
              className="mt-6 block text-center rounded bg-primary text-white font-semibold py-2.5 text-sm"
            >
              Xabar yuborish
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
