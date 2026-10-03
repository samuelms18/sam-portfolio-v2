'use client';

import { useRef } from 'react';
import type { MockType } from '@/content/types';
import { gsap, useGSAP } from '@/lib/gsap';
import { Mock } from './Mock';

/**
 * The wireframe pins in place and the high-fidelity design wipes across it as you
 * scroll. Without motion (phones, reduced motion) both are shown one after another.
 */
export function WireToVisual({ type, hue }: { type: MockType; hue: number }) {
  const root = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLDivElement>(null);
  const line = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        root.current!.classList.add('is-compare');
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: 'center center', end: '+=110%', pin: true, scrub: 0.6 },
        });
        tl.fromTo(top.current, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'none' }, 0).fromTo(
          line.current,
          { left: '0%' },
          { left: '100%', ease: 'none' },
          0
        );
        return () => root.current?.classList.remove('is-compare');
      });
    },
    { scope: root }
  );

  return (
    <div ref={root} className="wire-visual glass mt-6 rounded-3xl p-2">
      <div className="wv-stage relative overflow-hidden rounded-[18px]">
        <div className="wv-layer">
          <Mock type={type} hue={hue} wire />
          <span className="wv-label wv-label-r mono">Wireframe</span>
        </div>
        <div ref={top} className="wv-layer wv-top">
          <Mock type={type} hue={hue} />
          <span className="wv-label mono">Visual design</span>
        </div>
        <div ref={line} className="wv-line" aria-hidden="true" />
      </div>
      <p className="mono !max-w-none py-3 text-center !text-[11px]">Low-fidelity structure → high-fidelity direction · schematic</p>
    </div>
  );
}
