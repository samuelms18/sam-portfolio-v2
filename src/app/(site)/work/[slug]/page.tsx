import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ViewTransition, type CSSProperties, type ReactNode } from 'react';
import { CaseToc } from '@/components/CaseToc';
import { Mock } from '@/components/Mock';
import { PageTransition } from '@/components/PageTransition';
import { Reveal } from '@/components/Reveal';
import { WireToVisual } from '@/components/WireToVisual';
import { getContent } from '@/content';

export const dynamicParams = false;

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const { projects } = await getContent();
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.title} — ${p.subtitle}`, description: p.summary };
}

export default async function CaseStudy({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const { projects } = await getContent();
  const index = projects.findIndex((x) => x.slug === slug);
  if (index < 0) notFound();
  const p = projects[index];
  const next = projects[(index + 1) % projects.length];

  const sections: { id: string; label: string; body: ReactNode; pinned?: boolean }[] = [
    { id: 'context', label: 'Context', body: <p className="text-[clamp(18px,1.7vw,22px)] leading-relaxed">{p.context}</p> },
    { id: 'problem', label: 'Problem', body: <blockquote className="problem">{p.problem}</blockquote> },
    {
      id: 'role',
      label: 'My role',
      body: (
        <>
          <p>{p.myRole}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {p.tools.map((t) => (
              <li key={t} className="chip">{t}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 'understanding',
      label: 'Research & understanding',
      body: (
        <ul className="grid gap-3">
          {p.understanding.map((t) => (
            <li key={t} className="flex gap-3">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[hsl(var(--h)_70%_60%)]" />
              {t}
            </li>
          ))}
        </ul>
      ),
    },
    {
      id: 'process',
      label: 'UX process',
      body: (
        <ol className="grid gap-3">
          {p.process.map((t, i) => (
            <li key={t} className="glass grid grid-cols-[40px_1fr] rounded-2xl p-4">
              <span className="mono pt-1 !text-[hsl(var(--h)_70%_62%)]">{String(i + 1).padStart(2, '0')}</span>
              {t}
            </li>
          ))}
        </ol>
      ),
    },
    ...(p.wireframes
      ? [{
          id: 'wireframes',
          label: 'Wireframes',
          pinned: true,
          body: (
            <>
              <p>{p.wireframes}</p>
              <WireToVisual type={p.mock} hue={p.hue} />
            </>
          ),
        }]
      : []),
    ...(p.visual ? [{ id: 'visual', label: 'Visual design', body: <p>{p.visual}</p> }] : []),
    ...(p.screens?.length
      ? [{
          id: 'screens',
          label: 'Screens',
          body: (
            <div className="grid gap-6">
              {p.screens.map((sc, i) => (
                <figure key={sc.src} className="glass overflow-hidden rounded-3xl p-2">
                  {/* Unknown aspect ratios: render at natural size, capped to the column */}
                  <Image src={sc.src} alt={sc.alt || `${p.title} screen ${i + 1}`} width={2400} height={1500} sizes="(max-width: 1024px) 100vw, 900px" className="h-auto w-full rounded-[18px]" />
                  {sc.caption && <figcaption className="mono py-3 text-center !text-[11px]">{sc.caption}</figcaption>}
                </figure>
              ))}
            </div>
          ),
        }]
      : []),
    ...(p.prototype ? [{ id: 'prototype', label: 'Prototype', body: <p>{p.prototype}</p> }] : []),
    ...(p.development ? [{ id: 'development', label: 'Development', body: <p>{p.development}</p> }] : []),
    {
      id: 'result',
      label: 'Result',
      body: (
        <ul className="grid gap-4 sm:grid-cols-3">
          {p.outcome.map((t) => (
            <li key={t} className="glass grid content-start gap-4 rounded-3xl p-6 font-semibold">
              <span className="h-1 w-8 rounded-full bg-[hsl(var(--h)_70%_60%)]" />
              {t}
            </li>
          ))}
        </ul>
      ),
    },
    { id: 'learnings', label: 'Learnings', body: <p className="text-[clamp(18px,1.7vw,22px)] leading-relaxed">{p.learnings}</p> },
  ];

  return (
    <PageTransition>
    <article style={{ '--h': p.hue } as CSSProperties}>
      <header className="relative overflow-hidden pt-36 pb-12">
        <span className="pointer-events-none absolute -top-40 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,hsl(var(--h)_70%_50%/.22),transparent_65%)]" aria-hidden="true" />
        <div className="container-x grid gap-8">
          <Link href="/work" className="mono justify-self-start hover:!text-[var(--teal)]">← All work</Link>
          <span className="eyebrow">
            <b>Case study {String(index + 1).padStart(2, '0')}</b> {p.domain}
          </span>
          <h1 className="display text-[clamp(40px,6vw,96px)]">
            {p.title} <span className="block text-[hsl(var(--h)_70%_62%)]">{p.subtitle}</span>
          </h1>
          <p className="lede">{p.summary}</p>
          <dl className="glass grid overflow-hidden rounded-3xl sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Role', p.role],
              ['Tools', p.tools.join(', ')],
              ['Domain', p.domain],
              ['Platform', p.platform],
            ].map(([k, v]) => (
              <div key={k} className="grid gap-1.5 border-[var(--line)] p-5 max-lg:border-b lg:border-r lg:last:border-r-0">
                <dt className="mono !text-[11px]">{k}</dt>
                <dd className="font-semibold">{v}</dd>
              </div>
            ))}
          </dl>
          <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
            <div className="glass overflow-hidden rounded-[32px] p-2.5">
              <div className="overflow-hidden rounded-[24px]">
                {p.cover ? (
                  <div className="relative aspect-[16/9] md:aspect-[16/8]">
                    <Image src={p.cover} alt={`${p.title} — cover`} fill priority sizes="(max-width: 1280px) 100vw, 1200px" className="object-cover" />
                  </div>
                ) : (
                  <Mock type={p.mock} hue={p.hue} className="md:!aspect-[16/8]" />
                )}
              </div>
            </div>
          </ViewTransition>
          {!p.cover && <p className="mono text-center !text-[11px]">Visuals are schematic recreations. Production data and screens are confidential.</p>}
        </div>
      </header>

      <div className="container-x grid gap-12 pb-24 lg:grid-cols-[230px_1fr] lg:gap-20">
        <aside className="hidden lg:block">
          <div className="sticky top-28 grid gap-10">
            <CaseToc items={sections.map(({ id, label }) => ({ id, label }))} />
            <div className="grid gap-3">
              <span className="mono">Focus</span>
              <ul className="flex flex-wrap gap-2">
                {p.focus.map((f) => (
                  <li key={f} className="tag !text-[11px]">{f}</li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
        <div className="grid min-w-0 gap-20">
          {sections.map((s, i) => {
            const inner = (
              <div id={s.id} className="scroll-mt-28">
                <h2>
                  <span>{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </h2>
                {s.body}
              </div>
            );
            // Pinned sections can't sit inside a transformed (animated) parent.
            return s.pinned ? (
              <section key={s.id} className="cs-sec">{inner}</section>
            ) : (
              <Reveal as="section" key={s.id} className="cs-sec">{inner}</Reveal>
            );
          })}
        </div>
      </div>

      <Link href={`/work/${next.slug}`} className="group block border-t border-[var(--line)] py-20 md:py-28" style={{ '--h': next.hue } as CSSProperties}>
        <div className="container-x grid gap-4">
          <span className="eyebrow">Next case study</span>
          <span className="display text-[clamp(34px,5.4vw,84px)]">
            {next.title} <span className="text-[hsl(var(--h)_70%_62%)]">{next.subtitle}</span>{' '}
            <span className="inline-block transition-transform duration-500 group-hover:translate-x-3" aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </article>
    </PageTransition>
  );
}
