"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

export function SearchBox({ onClose }: { onClose?: () => void }) {
  const router = useRouter();
  const [open, setOpen] = useState(!!onClose);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    onClose?.();
    setOpen(false);
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Qidirish"
        className="p-2 rounded hover:bg-primary/5 transition"
      >
        <Search className="h-5 w-5" />
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Qidirish..."
          className="w-48 sm:w-64 rounded-full border border-border bg-surface pl-9 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
        />
      </div>
      <button
        type="button"
        onClick={() => {
          setOpen(false);
          onClose?.();
        }}
        aria-label="Yopish"
        className="p-1.5 text-muted hover:text-text"
      >
        <X className="h-4 w-4" />
      </button>
    </form>
  );
}
