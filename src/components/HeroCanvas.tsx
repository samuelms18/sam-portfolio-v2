'use client';

import dynamic from 'next/dynamic';
import { useReducedMotion } from 'motion/react';
import { useEffect, useState, type RefObject } from 'react';
import { useHtmlState } from '@/lib/useHtmlState';
import { usePreloaded } from '@/lib/usePreloaded';

// Three.js only loads in the browser, after the page is already visible.
const HeroScene = dynamic(() => import('./HeroScene'), { ssr: false });

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

type Props = { anchorRef: RefObject<HTMLElement | null>; sectionRef: RefObject<HTMLElement | null>; onReady: () => void };

export function HeroCanvas({ anchorRef, sectionRef, onReady }: Props) {
  const preloaded = usePreloaded();
  const reduceMotion = !!useReducedMotion();
  const lightTheme = useHtmlState((root) => root.dataset.theme === 'light', false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [active, setActive] = useState(true);

  // Wait for the preloader and an idle moment so the 3D never delays the first view.
  useEffect(() => {
    if (!preloaded) return;
    const start = () => {
      if (anchorRef.current && supportsWebGL()) setAnchor(anchorRef.current);
    };
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(start, { timeout: 1200 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(start, 300);
    return () => clearTimeout(id);
  }, [preloaded, anchorRef]);

  // Stop rendering while the hero is off screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setActive(e.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, [sectionRef]);

  if (!anchor) return null;
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 animate-[fadein_1.2s_ease_both]">
      <HeroScene anchor={anchor} active={active} reduceMotion={reduceMotion} lightTheme={lightTheme} onReady={onReady} />
    </div>
  );
}
