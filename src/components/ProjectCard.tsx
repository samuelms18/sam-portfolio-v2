import Image from 'next/image';
import Link from 'next/link';
import { ViewTransition, type CSSProperties } from 'react';
import type { Project } from '@/content/types';
import { Mock } from './Mock';

type Props = { project: Project; index: number; total: number; size?: 'lg' | 'md' };

/** Glass card. Its illustration morphs into the case-study hero on click (View Transitions). */
export function ProjectCard({ project: p, index, total, size = 'md' }: Props) {
  return (
    <Link
      href={`/work/${p.slug}`}
      className="glass group flex h-full min-w-0 flex-col overflow-hidden rounded-[28px] p-2.5 transition-[border-color,transform] duration-500 hover:-translate-y-1.5 hover:border-[hsl(var(--h)_70%_60%/.55)]"
      style={{ '--h': p.hue } as CSSProperties}
    >
      <ViewTransition name={`project-${p.slug}`} share="morph" default="none">
        <div className="overflow-hidden rounded-[20px]">
          {p.cover ? (
            <div className="relative aspect-[16/10.5] overflow-hidden">
              <Image src={p.cover} alt={`${p.title} — cover`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
            </div>
          ) : (
            <Mock type={p.mock} hue={p.hue} className="transition-transform duration-700 group-hover:scale-[1.03]" />
          )}
        </div>
      </ViewTransition>
      <div className={`flex flex-1 flex-col gap-3 ${size === 'lg' ? 'p-6 md:p-8' : 'p-5 md:p-6'}`}>
        <div className="mono flex justify-between gap-4">
          <span className="shrink-0">
            {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <span className="min-w-0 truncate">{p.domain}</span>
        </div>
        <h3 className={`font-display font-bold leading-[1.05] tracking-tight ${size === 'lg' ? 'text-[clamp(28px,3vw,44px)]' : 'text-[clamp(24px,2.4vw,32px)]'}`}>
          {p.title} <span className="block text-[hsl(var(--h)_70%_62%)]">{p.subtitle}</span>
        </h3>
        <p className="text-[var(--muted)]">{p.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-2 pt-3">
          {p.tools.slice(0, 4).map((t) => (
            <li key={t} className="tag">{t}</li>
          ))}
        </ul>
      </div>
    </Link>
  );
}
