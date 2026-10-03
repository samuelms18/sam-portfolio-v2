import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { Reveal } from '@/components/Reveal';
import { PageTransition } from '@/components/PageTransition';
import { site } from '@/content/data';

export const metadata: Metadata = { title: 'Contact', description: `Contact ${site.name}.` };

const SOCIAL_NAMES: Record<string, string> = { linkedin: 'LinkedIn', github: 'GitHub', behance: 'Behance', dribbble: 'Dribbble' };

export default function ContactPage() {
  const socials = Object.entries(site.socials).filter(([, url]) => url);
  return (
    <PageTransition>
    <section className="relative overflow-hidden pt-40 pb-24">
      <span className="orb orb-coral -right-20 top-40 -z-10 h-72 w-72 opacity-30 blur-2xl" aria-hidden="true" />
      <div className="container-x grid gap-14 lg:grid-cols-[1fr_1.2fr]">
        <Reveal className="grid content-start gap-8">
          <span className="eyebrow">Contact</span>
          <h1 className="display text-[clamp(48px,7vw,112px)]">
            Let&apos;s <span className="grad">talk.</span>
          </h1>
          <p className="lede">Open to UI/UX, Product Design and UI/UX Developer roles, especially enterprise, data-heavy and AI-powered products.</p>
          {site.email && (
            <a href={`mailto:${site.email}`} className="font-display text-[clamp(24px,3vw,40px)] font-bold tracking-tight text-[var(--teal)] break-all">
              {site.email}
            </a>
          )}
          <p className="text-[var(--muted)]">
            {site.role}
            <br />
            {site.location}
          </p>
          {socials.length > 0 && (
            <ul className="flex flex-wrap gap-6 font-semibold">
              {socials.map(([k, url]) => (
                <li key={k}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="link-u">{SOCIAL_NAMES[k]} ↗</a>
                </li>
              ))}
            </ul>
          )}
        </Reveal>
        <Reveal delay={0.1}>
          <ContactForm email={site.email} />
        </Reveal>
      </div>
    </section>
    </PageTransition>
  );
}
