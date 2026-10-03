'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from 'motion/react';
import { useRef, useState } from 'react';
import { site } from '@/content/data';
import { gsap, MOTION_OK, useGSAP } from '@/lib/gsap';
import { usePreloaded } from '@/lib/usePreloaded';
import { HeroCanvas } from './HeroCanvas';

const ease = [0.16, 1, 0.3, 1] as const;

/** Moves a layer with the pointer; `depth` > 1 is closer to the viewer. */
function useDepth(mx: MotionValue<number>, my: MotionValue<number>, depth: number) {
  const x = useTransform(mx, (v) => v * 18 * depth);
  const y = useTransform(my, (v) => v * 14 * depth);
  return { x, y };
}

export function Hero() {
  const ready = usePreloaded();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  // CSS spheres are the fallback; they fade out once the WebGL scene is running.
  const [scene, setScene] = useState(false);
  const cssOrb = `transition-opacity duration-1000 ${scene ? '!opacity-0' : ''}`;

  // Pointer position in the hero, -0.5 … 0.5, smoothed.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const mx = useSpring(px, { stiffness: 60, damping: 18 });
  const my = useSpring(py, { stiffness: 60, damping: 18 });
  const rotY = useTransform(mx, (v) => -12 + v * 16);
  const rotX = useTransform(my, (v) => 4 - v * 12);

  const far = useDepth(mx, my, -0.6);
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
      <HeroCanvas anchorRef={cardRef} sectionRef={ref} onReady={() => setScene(true)} />
      {/* Light sources (fallback) */}
      <motion.span style={far} className={`${cssOrb} orb orb-teal -z-10 right-[2vw] top-[8vh] h-[34vw] max-h-[460px] w-[34vw] max-w-[460px] opacity-50 blur-[2px]`} aria-hidden="true" />
      <motion.span style={mid} className={`${cssOrb} orb orb-pearl -z-10 right-[44vw] bottom-[12vh] h-10 w-10 opacity-70 max-lg:hidden`} aria-hidden="true" />

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

        {/* Photo on a glass plane, with floating info cards at different depths */}
        <div className="hero-card-lag">
        <motion.div
          ref={cardRef}
          initial={reduce ? false : { opacity: 0, scale: 0.92 }}
          animate={ready ? { opacity: 1, scale: 1 } : undefined}
          transition={{ duration: 1.4, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-[420px] [perspective:1200px] max-lg:max-w-[340px]"
        >
          <motion.div
            style={reduce ? undefined : { rotateY: rotY, rotateX: rotX }}
            className="glass relative rounded-[28px] p-2.5 shadow-[var(--shadow)] [transform-style:preserve-3d]"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
              <Image src={site.photo} alt={`Portrait of ${site.name}`} fill priority sizes="(max-width: 1024px) 340px, 420px" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          </motion.div>

          <motion.div style={near} className="glass-dense absolute -left-10 bottom-24 grid gap-0.5 rounded-2xl px-5 py-3.5 max-sm:-left-3">
            <span className="text-xs text-[var(--muted)]">Currently</span>
            <b className="text-[15px]">{site.currently}</b>
          </motion.div>
          <motion.div style={nearer} className="glass-dense absolute -right-8 -bottom-6 grid gap-0.5 rounded-2xl px-5 py-3.5 max-sm:-right-3">
            <span className="text-xs text-[var(--muted)]">Focus</span>
            <b className="text-[15px]">Enterprise UX · Data</b>
          </motion.div>
          <motion.div style={mid} className="glass-dense absolute -right-6 top-10 grid gap-0.5 rounded-2xl px-4 py-3 max-sm:-right-2">
            <span className="text-xs text-[var(--muted)]">Experience</span>
            <b className="text-[15px]">~3 years</b>
          </motion.div>
          <motion.span style={nearer} className={`${cssOrb} orb orb-coral -left-14 top-[38%] h-16 w-16 max-sm:-left-4 max-sm:h-12 max-sm:w-12`} aria-hidden="true" />
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
