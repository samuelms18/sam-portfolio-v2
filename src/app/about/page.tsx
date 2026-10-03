import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Reveal } from '@/components/Reveal';
import { EducationList, ExperienceList, Exploring, ProcessSteps, SectionHead, SkillsGrid } from '@/components/Sections';
import { bio, principles, site } from '@/content/data';

export const metadata: Metadata = { title: 'About', description: `About ${site.name}, ${site.role}.` };

export default function AboutPage() {
  return (
    <>
      <section className="pt-40 pb-16">
        <div className="container-x grid items-start gap-14 lg:grid-cols-[1.2fr_0.8fr]">
          <Reveal className="grid gap-8">
            <span className="eyebrow">About</span>
            <h1 className="display text-[clamp(48px,7vw,112px)]">
              Hi, I&apos;m {site.name}
              <span className="grad">.</span>
            </h1>
            <p className="lede">{site.introAlt}</p>
            {bio.map((b) => (
              <p key={b.slice(0, 20)} className="max-w-[62ch] text-[clamp(17px,1.4vw,20px)] leading-relaxed">{b}</p>
            ))}
            <p>Based in {site.location}.</p>
            <div className="flex flex-wrap gap-3">
              {site.resume && (
                <a href={site.resume} download className="btn btn-primary">Download resume ↓</a>
              )}
              <Link href="/contact" className="btn btn-ghost">Get in touch →</Link>
            </div>
          </Reveal>
          <Reveal delay={0.15} className="relative mx-auto w-full max-w-[400px] lg:sticky lg:top-28">
            <div className="glass rounded-[28px] p-2.5">
              <div className="relative aspect-[3/4] overflow-hidden rounded-[20px]">
                <Image src={site.photo} alt={`Portrait of ${site.name}`} fill priority sizes="400px" className="object-cover" />
              </div>
            </div>
            <span className="orb orb-teal -left-8 -bottom-8 h-24 w-24 opacity-80" aria-hidden="true" />
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHead num="01" eyebrow="Philosophy">
            How I <span className="grad">think about design.</span>
          </SectionHead>
          <div className="grid gap-4 md:grid-cols-2">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08} className="glass grid content-start gap-3 rounded-3xl p-8">
                <h3 className="font-display text-[clamp(22px,2.2vw,30px)] font-bold tracking-tight">{p.title}</h3>
                <p className="text-[var(--muted)]">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHead num="02" eyebrow="Process">
            My design <span className="grad">process.</span>
          </SectionHead>
          <ProcessSteps />
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHead num="03" eyebrow="Skills">
            Skills &amp; <span className="grad">tools.</span>
          </SectionHead>
          <SkillsGrid />
          <Exploring />
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHead num="04" eyebrow="Experience">
            Experience<span className="grad">.</span>
          </SectionHead>
          <ExperienceList />
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-x">
          <SectionHead num="05" eyebrow="Education">
            Education<span className="grad">.</span>
          </SectionHead>
          <EducationList />
        </div>
      </section>
    </>
  );
}
