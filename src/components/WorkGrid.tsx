'use client';

import { useState, type ReactNode } from 'react';

type Item = { categories: string[]; node: ReactNode; key: string };

/** Filter chips over pre-rendered project cards. */
export function WorkGrid({ items }: { items: Item[] }) {
  const cats = ['All', ...Array.from(new Set(items.flatMap((i) => i.categories)))];
  const [filter, setFilter] = useState('All');
  const shown = items.filter((i) => filter === 'All' || i.categories.includes(filter));
  return (
    <>
      <div role="group" aria-label="Filter projects" className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={filter === c}
            onClick={() => setFilter(c)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              filter === c ? 'border-[var(--text)] bg-[var(--text)] text-[var(--bg)]' : 'glass text-[var(--muted)] hover:text-[var(--text)]'
            }`}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {shown.map((i) => (
          <div key={i.key}>{i.node}</div>
        ))}
      </div>
    </>
  );
}
