'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { site } from '@/content/data';
import { ThemeToggle } from './ThemeToggle';

const NAV = [
  { href: '/work', label: 'Work' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 24);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? 'py-3' : 'py-5'}`}
        style={{ paddingTop: `calc(${scrolled ? '12px' : '20px'} + env(safe-area-inset-top, 0px))` }}
      >
        <div className="container-x flex items-center justify-between gap-4">
          <Link href="/" className="font-display text-2xl font-extrabold tracking-tight" aria-label={`${site.name} — home`}>
            {site.name.toLowerCase()}
            <span className="text-[var(--teal)]">.</span>
          </Link>

          <nav aria-label="Primary" className="glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? 'page' : undefined}
                className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                  active(n.href) ? 'bg-[var(--glass-2)] text-[var(--text)]' : 'text-[var(--muted)] hover:text-[var(--text)]'
                }`}
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {site.resume && (
              <a href={site.resume} download className="btn btn-ghost hidden !px-4 !py-2.5 text-sm md:inline-flex">
                Resume ↓
              </a>
            )}
            <ThemeToggle />
            <button
              type="button"
              className="glass relative grid h-10 w-10 place-items-center rounded-full md:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((o) => !o)}
            >
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? 'rotate-45' : '-translate-y-[3px]'}`} />
              <span className={`absolute h-[1.5px] w-4 bg-current transition-transform duration-300 ${open ? '-rotate-45' : 'translate-y-[3px]'}`} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-40 flex flex-col justify-center gap-2 bg-[var(--bg)] px-6 md:hidden">
          {[{ href: '/', label: 'Home' }, ...NAV].map((n, i) => (
            <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="font-display flex items-baseline gap-4 text-5xl font-extrabold tracking-tight">
              <span className="mono !text-[var(--teal)]">0{i + 1}</span>
              {n.label}
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
