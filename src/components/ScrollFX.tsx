'use client';

import { useRef, type ReactNode } from 'react';
import { MOTION_OK, gsap, SplitText, useGSAP } from '@/lib/gsap';

/** Heading whose lines rise out of a mask as it scrolls into view. */
export function SplitHeading({ children, className = '', as: Tag = 'h2' }: { children: ReactNode; className?: string; as?: 'h1' | 'h2' }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const split = SplitText.create(ref.current!, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
        gsap.from(split.lines, {
          yPercent: 110,
          duration: 1.1,
          ease: 'expo.out',
          stagger: 0.09,
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        });
        return () => split.revert();
      });
    },
    { scope: ref }
  );
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Rises toward the viewer from a tilted, distant position as it enters (scrubbed). */
export function DepthIn({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.fromTo(
          ref.current,
          { rotateX: 16, y: 120, scale: 0.9, opacity: 0.2, transformPerspective: 1200, transformOrigin: '50% 0%' },
          {
            rotateX: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'top 62%', scrub: 0.6 },
          }
        );
      });
    },
    { scope: ref }
  );
  return (
    <div ref={ref} className={`min-w-0 ${className}`}>
      {children}
    </div>
  );
}
