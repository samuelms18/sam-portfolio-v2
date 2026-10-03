import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Preloader } from '@/components/Preloader';
import { Spotlight } from '@/components/Spotlight';
import { getContent } from '@/content';

/** Site chrome (everything except the /studio dashboard). */
export default async function SiteLayout({ children }: LayoutProps<'/'>) {
  const { site } = await getContent();
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-[var(--teal)] focus:px-4 focus:py-2 focus:text-[var(--ink-on-light)]"
      >
        Skip to content
      </a>
      <Preloader name={site.name} />
      <Spotlight />
      <div className="grain" aria-hidden="true" />
      <Header name={site.name} resume={site.resume} />
      <main id="main" className="relative z-[1]">
        {children}
      </main>
      <Footer />
    </>
  );
}
