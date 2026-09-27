"use client";

import Link from "next/link";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { User, LogOut, LayoutDashboard } from "lucide-react";

interface SessionUser {
  displayName: string;
  username: string;
}

export function AccountMenu({ user }: { user: SessionUser | null }) {
  const [open, setOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden sm:flex items-center gap-1.5 text-sm font-medium hover:text-primary"
      >
        <User className="h-5 w-5" />
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 rounded-full bg-primary/10 text-primary h-9 w-9 justify-center font-bold text-sm"
        aria-label="Hisob menyusi"
      >
        {user.displayName.charAt(0).toUpperCase()}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-48 bg-surface border border-border rounded-lg shadow-lg z-20 py-1">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-bg"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm hover:bg-bg text-breaking"
            >
              <LogOut className="h-4 w-4" /> Chiqish
            </button>
          </div>
        </>
      )}
    </div>
  );
}
