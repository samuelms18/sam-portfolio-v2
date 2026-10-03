'use client';

import { useRef, type ReactNode } from 'react';
import type { ProcessStep } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';

/**
 * Desktop: the section pins and the five steps travel sideways as you scroll,
 * with a line tracking progress. Phones and reduced motion: a plain grid.
 */
export function ProcessSection({ head, process }: { head: ReactNode; process: ProcessStep[] }) {
  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLOListElement>(null);
  const bar = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current!;
        const distance = () => el.scrollWidth - el.parentElement!.clientWidth;
        gsap.to(el, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: section.current,
            start: 'top top',
            end: () => `+=${distance() + window.innerHeight * 0.4}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(bar.current, { scaleX: self.progress }),
          },
        });
      });
    },
    { scope: section }
  );

  return (
    <section ref={section} className="section lg:flex lg:min-h-[100svh] lg:flex-col lg:justify-center lg:py-24">
      <div className="container-x w-full">
        {head}
        <div className="overflow-hidden lg:overflow-visible">
          <ol ref={track} className="grid gap-4 sm:grid-cols-2 lg:flex lg:w-max lg:gap-6">
            {process.map((s, i) => (
              <li key={s.step} className="glass relative flex flex-col gap-4 overflow-hidden rounded-3xl p-6 lg:w-[380px] lg:p-8">
                <span className="grad font-display text-5xl font-bold tracking-tight lg:text-7xl">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="text-lg font-bold lg:text-2xl">{s.step}</h3>
                <p className="text-[15px] text-[var(--muted)] lg:text-base">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="mt-10 hidden h-px bg-[var(--line)] lg:block" aria-hidden="true">
          <div ref={bar} className="h-full origin-left scale-x-0 bg-gradient-to-r from-[var(--teal)] to-[var(--coral)]" />
        </div>
      </div>
    </section>
  );
}
