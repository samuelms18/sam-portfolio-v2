'use client';

import { useHtmlState } from '@/lib/useHtmlState';

type Theme = 'dark' | 'light';

/** Dark is the default; the choice is remembered per browser. */
export function ThemeToggle() {
  const theme = useHtmlState<Theme>((root) => (root.dataset.theme === 'light' ? 'light' : 'dark'), 'dark');

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    if (next === 'light') document.documentElement.dataset.theme = 'light';
    else delete document.documentElement.dataset.theme;
    try {
      localStorage.setItem('theme', next);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="glass relative grid h-10 w-10 place-items-center overflow-hidden rounded-full transition-colors hover:border-[var(--teal)]"
    >
      <span
        className="absolute h-3.5 w-3.5 rounded-full bg-[var(--coral)] shadow-[0_0_0_4px_rgba(255,122,89,.2)] transition-all duration-500"
        style={{ transform: theme === 'light' ? 'translateY(0)' : 'translateY(-28px)', opacity: theme === 'light' ? 1 : 0 }}
      />
      <span
        className="absolute h-4 w-4 rounded-full transition-all duration-500"
        style={{
          boxShadow: 'inset -5px -3px 0 0 var(--teal)',
          transform: theme === 'dark' ? 'translateY(0) rotate(-30deg)' : 'translateY(28px)',
          opacity: theme === 'dark' ? 1 : 0,
        }}
      />
    </button>
  );
}
