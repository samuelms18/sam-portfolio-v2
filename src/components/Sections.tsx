import type { ReactNode } from 'react';
import { getContent } from '@/content';
import { Reveal } from './Reveal';
import { SplitHeading } from './ScrollFX';

export function SectionHead({ eyebrow, num, children, lede }: { eyebrow: string; num?: string; children: ReactNode; lede?: string }) {
  return (
    <div className="mb-14 grid gap-5">
      <Reveal>
        <span className="eyebrow">
          {num && <b>{num}</b>}
          {eyebrow}
        </span>
      </Reveal>
      <SplitHeading className="sec-title max-w-[18ch]">{children}</SplitHeading>
      {lede && (
        <Reveal delay={0.15}>
          <p className="lede">{lede}</p>
        </Reveal>
      )}
    </div>
  );
}

export async function SkillsGrid() {
  const { skills } = await getContent();
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

export async function Exploring() {
  const { exploring } = await getContent();
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

export async function ExperienceList() {
  const { experience } = await getContent();
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

export async function EducationList() {
  const { education } = await getContent();
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
