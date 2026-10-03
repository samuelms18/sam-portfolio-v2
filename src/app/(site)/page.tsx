import Image from 'next/image';
import Link from 'next/link';
import { Hero } from '@/components/Hero';
import { ProjectCard } from '@/components/ProjectCard';
import { Reveal } from '@/components/Reveal';
import { Marquee } from '@/components/Marquee';
import { PageTransition } from '@/components/PageTransition';
import { ProcessSection } from '@/components/ProcessSection';
import { DepthIn } from '@/components/ScrollFX';
import { ExperienceList, Exploring, SectionHead, SkillsGrid } from '@/components/Sections';
import { getContent } from '@/content';

export default async function Home() {
  const { bio, domains, projects, site, process } = await getContent();
  return (
    <PageTransition>
      <Hero site={site} />
      <Marquee items={domains} />

      <section id="work" className="section">
        <div className="container-x">
          <SectionHead
            num="01"
            eyebrow="Selected work"
            lede="Six projects across manufacturing, finance, insurance, commerce and internal tools. Each case study shows the problem, my thinking, and how the design came together."
          >
            Enterprise products, <span className="grad">made human.</span>
          </SectionHead>
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <DepthIn key={p.slug}>
                <ProjectCard project={p} index={i} total={projects.length} size={i < 2 ? 'lg' : 'md'} />
              </DepthIn>
            ))}
          </div>
          <Reveal className="mt-14 flex justify-center">
            <Link href="/work" className="btn btn-ghost">
              All case studies →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section overflow-x-clip">
        <div className="container-x grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal className="relative mx-auto w-full max-w-[380px]">
            <div className="glass rounded-[28px] p-2.5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[20px]">
                <Image src={site.photo} alt={`Portrait of ${site.name}`} fill sizes="380px" className="object-cover object-top" />
              </div>
            </div>
            <span className="orb orb-coral -right-6 -top-6 h-16 w-16" aria-hidden="true" />
          </Reveal>
          <div>
            <SectionHead num="02" eyebrow="About">
              A designer who <span className="grad">speaks developer.</span>
            </SectionHead>
            <Reveal className="grid gap-8">
              <p className="text-[clamp(18px,1.6vw,22px)] leading-relaxed">{bio[0]}</p>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ['Experience', '~3 years'],
                  ['Based in', site.location],
                  ['Focus', 'Enterprise UX'],
                  ['Toolkit', 'Figma → Code'],
                ].map(([k, v]) => (
                  <div key={k} className="glass grid gap-1 rounded-2xl p-4">
                    <dt className="mono !text-[11px]">{k}</dt>
                    <dd className="font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <Link href="/about" className="link-u justify-self-start font-semibold">
                More about me &amp; how I work →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <ProcessSection
        process={process}
        head={
          <SectionHead num="03" eyebrow="Process">
            From messy requirements <span className="grad">to shipped screens.</span>
          </SectionHead>
        }
      />

      <section className="section">
        <div className="container-x">
          <SectionHead num="04" eyebrow="Capabilities">
            What I bring <span className="grad">to a team.</span>
          </SectionHead>
          <SkillsGrid />
          <Exploring />
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <SectionHead num="05" eyebrow="Experience">
            Where I&apos;ve <span className="grad">been building.</span>
          </SectionHead>
          <ExperienceList />
        </div>
      </section>

      <section className="section overflow-hidden">
        <span className="orb orb-teal -left-40 top-10 h-96 w-96 opacity-25 blur-2xl" aria-hidden="true" />
        <div className="container-x relative">
          <Reveal className="glass grid gap-8 rounded-[36px] p-8 md:p-16">
            <span className="eyebrow">
              <b>06</b> Contact
            </span>
            <h2 className="display text-[clamp(34px,5vw,76px)]">
              Have a complex product? <span className="grad">Let&apos;s talk.</span>
            </h2>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary">
                Start a conversation →
              </Link>
              {site.email && (
                <a href={`mailto:${site.email}`} className="btn btn-ghost">
                  {site.email}
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </PageTransition>
  );
}
