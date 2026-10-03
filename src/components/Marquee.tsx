'use client';

import { useRef } from 'react';
import { MOTION_OK, ScrollTrigger, gsap, useGSAP } from '@/lib/gsap';

/** Domain ticker: drifts on its own, speeds up and follows your scroll direction. */
export function Marquee({ items }: { items: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const loop = gsap.to(track.current, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
        const st = ScrollTrigger.create({
          trigger: root.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const boost = Math.min(Math.abs(self.getVelocity()) / 250, 6);
            gsap.to(loop, { timeScale: self.direction * (1 + boost), duration: 0.2, overwrite: true });
            gsap.to(loop, { timeScale: self.direction, duration: 1.2, delay: 0.2, overwrite: false });
          },
        });
        return () => st.kill();
      });
    },
    { scope: root }
  );
  const row = [...items, ...items];
  return (
    <div ref={root} className="overflow-hidden border-y border-[var(--line)] py-6" aria-label="Domains I design for">
      <div ref={track} className="flex w-max items-center gap-10">
        {row.map((d, i) => (
          <span
            key={i}
            aria-hidden={i >= items.length || undefined}
            className="flex items-center gap-10 whitespace-nowrap font-display text-[clamp(26px,3.6vw,46px)] font-bold tracking-tight"
          >
            {d}
            <i className="orb orb-teal !relative inline-block h-3 w-3" />
          </span>
        ))}
      </div>
    </div>
  );
}
