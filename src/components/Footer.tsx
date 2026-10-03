import Link from 'next/link';
import { getContent } from '@/content';

const SOCIAL_NAMES: Record<string, string> = { linkedin: 'LinkedIn', github: 'GitHub', behance: 'Behance', dribbble: 'Dribbble' };

export async function Footer() {
  const { site } = await getContent();
  const socials = Object.entries(site.socials).filter(([, url]) => url);
  return (
    <footer className="relative overflow-hidden border-t border-[var(--line)] pt-24 pb-10">
      <span className="orb orb-teal -right-24 -bottom-40 h-96 w-96 opacity-30 blur-2xl" aria-hidden="true" />
      <div className="container-x relative">
        <p className="display max-w-[16ch] text-[clamp(36px,5.6vw,88px)]">
          Let&apos;s make something complex <span className="grad">feel simple.</span>
        </p>
        <div className="mt-16 flex flex-wrap items-end justify-between gap-8 border-t border-[var(--line)] pt-8">
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-semibold">
            {site.email ? (
              <a href={`mailto:${site.email}`} className="link-u">{site.email}</a>
            ) : (
              <Link href="/contact" className="link-u">Get in touch →</Link>
            )}
            {socials.map(([key, url]) => (
              <a key={key} href={url} target="_blank" rel="noopener noreferrer" className="link-u">
                {SOCIAL_NAMES[key]} ↗
              </a>
            ))}
          </div>
          <p className="text-sm text-[var(--faint)]">
            © {new Date().getFullYear()} {site.name}. Designed &amp; built by {site.name} with Next.js.
          </p>
        </div>
      </div>
    </footer>
  );
}
