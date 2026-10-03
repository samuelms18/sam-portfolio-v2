'use client';

import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef } from 'react';
import type { Site } from '@/content/types';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { usePreloaded } from '@/lib/usePreloaded';
import { IntroVideo } from './IntroVideo';

const ease = [0.16, 1, 0.3, 1] as const;

/** Moves a layer with the pointer; `depth` > 1 is closer to the viewer. */
function useDepth(mx: MotionValue<number>, my: MotionValue<number>, depth: number) {
  const x = useTransform(mx, (v) => v * 18 * depth);
  const y = useTransform(my, (v) => v * 14 * depth);
  return { x, y };
}

export function Hero({ site }: { site: Site }) {
  const ready = usePreloaded();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);

  // Pointer position in the hero, -0.5 … 0.5, smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });

  const mid = useDepth(mx, my, 0.5);
  const near = useDepth(mx, my, 1.3);
  const nearer = useDepth(mx, my, 1.8);

  // Scrolling out of the hero: headline lines drift apart, the card lags behind.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const lines = gsap.utils.toArray<HTMLElement>('.hero-line');
        const st = { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.5 };
        lines.forEach((l, i) => gsap.to(l, { xPercent: (i % 2 ? 1 : -1) * (18 + i * 6), opacity: 0.1, ease: 'none', scrollTrigger: st }));
        gsap.to('.hero-card-lag', { yPercent: 12, ease: 'none', scrollTrigger: st });
      });
    },
    { scope: ref }
  );

  const onMove = (e: React.PointerEvent) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  const show = (delay: number) =>
    reduce
      ? {}
      : { initial: { opacity: 0, y: 40 }, animate: ready ? { opacity: 1, y: 0 } : undefined, transition: { duration: 1.1, delay, ease } };

  return (
    <section
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative isolate flex min-h-[100svh] items-center overflow-hidden pt-32 pb-20"
    >
      {/* Soft light behind the video card */}
      <span className="pointer-events-none absolute right-[-10vw] top-[5vh] -z-10 h-[70vh] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(31,209,178,.18),transparent_65%)]" aria-hidden="true" />

      <div className="container-x grid items-center gap-16 lg:grid-cols-[minmax(0,1.2fr)_minmax(340px,0.8fr)]">
        <div className="relative z-10 flex min-w-0 flex-col gap-7">
          <motion.p {...show(0)} className="flex">
            <span className="glass inline-flex items-center gap-3 rounded-full px-4 py-2 text-sm text-[var(--muted)]">
              <span className="pulse" /> Currently at {site.currently}
            </span>
          </motion.p>

          <h1 className="display text-[clamp(40px,4.9vw,74px)]" aria-label={site.intro}>
            <motion.span {...show(0.1)} className="block" aria-hidden="true"><span className="hero-line inline-block">I turn complex</span></motion.span>
            <motion.span {...show(0.2)} className="block" aria-hidden="true"><span className="hero-line inline-block">workflows into</span></motion.span>
            <motion.span {...show(0.3)} className="block" aria-hidden="true"><span className="hero-line grad inline-block">simple, purposeful</span></motion.span>
            <motion.span {...show(0.4)} className="block" aria-hidden="true"><span className="hero-line inline-block">experiences.</span></motion.span>
          </h1>

          <motion.p {...show(0.5)} className="lede">
            {site.role}. {site.support}
          </motion.p>

          <motion.div {...show(0.6)} className="flex flex-wrap gap-3">
            <Link href="/work" className="btn btn-primary">
              Explore my work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Get in touch
            </Link>
          </motion.div>
        </div>

        {/* Self-intro video (photo until the video is added), with floating info cards */}
        <div className="hero-card-lag">
        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.4, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-[420px] max-lg:max-w-[340px]"
        >
          <div className="glass relative rounded-[28px] p-2.5 shadow-[var(--shadow)]">
            <IntroVideo site={site} />
          </div>

          <motion.div style={near} className="glass-dense pointer-events-none absolute -left-10 top-[42%] grid gap-0.5 rounded-2xl px-5 py-3.5 max-sm:-left-3">
            <span className="text-xs text-[var(--muted)]">Currently</span>
            <b className="text-[15px]">{site.currently}</b>
          </motion.div>
          <motion.div style={nearer} className="glass-dense pointer-events-none absolute -right-8 bottom-24 grid gap-0.5 rounded-2xl px-5 py-3.5 max-sm:-right-3">
            <span className="text-xs text-[var(--muted)]">Focus</span>
            <b className="text-[15px]">Enterprise UX · Data</b>
          </motion.div>
          <motion.div style={mid} className="glass-dense pointer-events-none absolute -right-6 top-16 grid gap-0.5 rounded-2xl px-4 py-3 max-sm:-right-2">
            <span className="text-xs text-[var(--muted)]">Experience</span>
            <b className="text-[15px]">~3 years</b>
          </motion.div>
        </motion.div>
        </div>
      </div>

      <a href="#work" className="mono absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 !text-[10px] md:flex" aria-label="Scroll to selected work">
        Scroll
        <span className="h-10 w-px bg-gradient-to-b from-[var(--teal)] to-transparent" />
      </a>
    </section>
  );
}
