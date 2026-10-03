import type { Metadata } from 'next';
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { WorkGrid } from '@/components/WorkGrid';
import { projects } from '@/content/data';

export const metadata: Metadata = {
  title: 'Work',
  description: 'Case studies by Sam: enterprise UX, dashboards and workflow design.',
};

export default function WorkPage() {
  return (
    <section className="pt-40 pb-24">
      <div className="container-x">
        <Reveal className="mb-12 grid gap-6">
          <span className="eyebrow">
            <b>{String(projects.length).padStart(2, '0')}</b> Case studies
          </span>
          <h1 className="display text-[clamp(48px,7.4vw,120px)]">
            Selected <span className="grad">work</span>
          </h1>
          <p className="lede">Enterprise applications, dashboards and workflow-driven systems, designed to make complicated work feel straightforward.</p>
        </Reveal>
        <WorkGrid
          items={projects.map((p, i) => ({
            key: p.slug,
            categories: p.category,
            node: <ProjectCard project={p} index={i} total={projects.length} />,
          }))}
        />
        <p className="mono mt-12 text-center !text-[11px]">Visuals are schematic recreations. Production data and screens are confidential.</p>
      </div>
    </section>
  );
}
