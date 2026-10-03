'use client';

import { useEffect, useState } from 'react';

/**
 * First visit per session: an orb gathers light while a counter runs to 100,
 * then the panel lifts away. The inline script in <head> decides whether to show it,
 * so returning visitors never see a flash.
 */
export function Preloader({ name }: { name: string }) {
  const [count, setCount] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'leave' | 'done'>('idle');

  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('is-loading')) return; // CSS keeps the idle panel hidden
    const t0 = performance.now();
    const MIN = 1500;
    let ready = false;
    const settle = () => (ready = true);
    Promise.race([
      Promise.all([document.fonts?.ready, new Promise((r) => (document.readyState === 'complete' ? r(0) : addEventListener('load', r, { once: true })))]),
      new Promise((r) => setTimeout(r, 3200)),
    ]).then(settle, settle);

    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / MIN) * (ready ? 1 : 0.9);
      setCount(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      try {
        sessionStorage.setItem('loaded', '1');
      } catch {}
      root.classList.remove('is-loading');
      setPhase('leave');
      window.dispatchEvent(new Event('preloaded'));
      setTimeout(() => setPhase('done'), 1000);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  if (phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      data-phase={phase}
      className="preloader fixed inset-0 z-[100] flex flex-col items-center justify-center gap-10 bg-[var(--bg)]"
      style={{
        transform: phase === 'leave' ? 'translateY(-100%)' : 'none',
        transition: 'transform 0.95s cubic-bezier(0.76, 0, 0.24, 1)',
        borderRadius: phase === 'leave' ? '0 0 50% 50% / 0 0 18% 18%' : 0,
      }}
    >
      <div className="relative grid h-40 w-40 place-items-center">
        <span
          className="orb orb-teal"
          style={{ inset: 0, transform: `scale(${0.35 + (count / 100) * 0.65})`, transition: 'transform 0.2s linear', opacity: 0.9 }}
        />
        <span className="orb orb-coral" style={{ width: 22, height: 22, right: -6, top: 18 }} />
      </div>
      <div className="flex w-[min(320px,80vw)] flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <span className="font-display text-2xl font-extrabold">
            {name.toLowerCase()}
            <span className="text-[var(--teal)]">.</span>
          </span>
          <span className="mono tabular-nums !text-[var(--text)]">{String(count).padStart(3, '0')}</span>
        </div>
        <div className="h-px overflow-hidden bg-[var(--line)]">
          <div className="h-full origin-left bg-[var(--teal)]" style={{ transform: `scaleX(${count / 100})` }} />
        </div>
      </div>
    </div>
  );
}
