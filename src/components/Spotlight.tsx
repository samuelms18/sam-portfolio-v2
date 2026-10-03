'use client';

import { useEffect, useRef } from 'react';

/** A soft light that follows the cursor (mouse/trackpad only). */
export function Spotlight() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ref.current?.style.setProperty('--mx', `${e.clientX}px`);
        ref.current?.style.setProperty('--my', `${e.clientY}px`);
      });
    };
    addEventListener('pointermove', onMove, { passive: true });
    return () => removeEventListener('pointermove', onMove);
  }, []);
  return <div ref={ref} className="spotlight" aria-hidden="true" />;
}
