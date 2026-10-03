import type { CSSProperties, ReactNode } from 'react';
import { education, experience, exploring, process, skills } from '@/content/data';
import { Reveal } from './Reveal';

export function SectionHead({ eyebrow, num, children, lede }: { eyebrow: string; num?: string; children: ReactNode; lede?: string }) {
  return (
    <Reveal className="mb-14 grid gap-5">
      <span className="eyebrow">
        {num && <b>{num}</b>}
        {eyebrow}
      </span>
      <h2 className="sec-title max-w-[18ch]">{children}</h2>
      {lede && <p className="lede">{lede}</p>}
    </Reveal>
  );
}

/** The five steps really are a sequence, so they're numbered. */
export function ProcessSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {process.map((s, i) => (
        <Reveal as="li" key={s.step} delay={i * 0.08} className="glass relative flex flex-col gap-3 overflow-hidden rounded-3xl p-6">
          <span className="grad font-display text-5xl font-bold tracking-tight">{String(i + 1).padStart(2, '0')}</span>
          <h3 className="text-lg font-bold">{s.step}</h3>
          <p className="text-[15px] text-[var(--muted)]">{s.text}</p>
        </Reveal>
      ))}
    </ol>
  );
}

export function SkillsGrid() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr_1fr]">
      {skills.map((g, i) => (
        <Reveal key={g.group} delay={i * 0.08} className="glass rounded-3xl p-6 md:p-8">
          <h3 className="mb-5 text-lg font-bold">{g.group}</h3>
          <ul className="flex flex-wrap gap-2">
            {g.items.map((s) => (
              <li key={s} className="chip">{s}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}

export function Exploring() {
  return (
    <Reveal className="mt-6 flex flex-wrap items-center gap-4 rounded-3xl border border-dashed border-[var(--glass-line)] p-6">
      <span className="eyebrow">
        <span className="pulse" /> Currently exploring
      </span>
      <ul className="flex flex-wrap gap-2">
        {exploring.map((s) => (
          <li key={s} className="chip !bg-transparent">{s}</li>
        ))}
      </ul>
    </Reveal>
  );
}

export function ExperienceList() {
  return (
    <ol className="grid gap-4">
      {experience.map((e, i) => (
        <Reveal as="li" key={e.company} delay={i * 0.05} className="glass grid gap-3 rounded-3xl p-6 md:grid-cols-[200px_1fr] md:gap-8 md:p-8">
          <span className="mono pt-1.5">{e.period}</span>
          <div className="grid gap-2">
            <h3 className="font-display text-[clamp(22px,2.4vw,30px)] font-bold tracking-tight">{e.company}</h3>
            <span className="font-semibold text-[var(--teal)]">{e.role}</span>
            <p className="max-w-[60ch] text-[var(--muted)]">{e.text}</p>
            {e.highlights && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {e.highlights.map((h) => (
                  <li key={h} className="tag">{h}</li>
                ))}
              </ul>
            )}
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

export function EducationList() {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {education.map((e, i) => (
        <Reveal as="li" key={e.title} delay={i * 0.08} className="glass grid gap-2 rounded-3xl p-6 md:p-8">
          <span className="mono">{e.year}</span>
          <h3 className="font-display text-2xl font-bold tracking-tight">{e.title}</h3>
          <span className="font-semibold text-[var(--teal)]">{e.place}</span>
          {e.grade && <p className="text-[var(--muted)]">{e.grade}</p>}
        </Reveal>
      ))}
    </ol>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="marquee overflow-hidden border-y border-[var(--line)] py-6" aria-label="Domains I design for">
      <div className="marquee-track flex w-max items-center gap-10">
        {row.map((d, i) => (
          <span key={i} aria-hidden={i >= items.length || undefined} className="flex items-center gap-10 whitespace-nowrap font-display text-[clamp(26px,3.6vw,46px)] font-bold tracking-tight">
            {d}
            <i className="orb orb-teal relative inline-block h-3 w-3 not-italic" style={{ position: 'relative' } as CSSProperties} />
          </span>
        ))}
      </div>
    </div>
  );
}
