'use client';

import { useEffect, useState } from 'react';

/** Sticky contents list that highlights the section in view. */
export function CaseToc({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-35% 0px -60% 0px' }
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [items]);
  return (
    <nav aria-label="Case study sections" className="grid gap-3">
      <span className="mono">Contents</span>
      <ol className="grid border-l border-[var(--line)]">
        {items.map((i) => (
          <li key={i.id}>
            <a
              href={`#${i.id}`}
              className={`-ml-px block border-l py-1.5 pl-4 text-sm transition-colors ${
                active === i.id ? 'border-[hsl(var(--h)_70%_60%)] text-[var(--text)]' : 'border-transparent text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              {i.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
