import Link from 'next/link';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { PageTransition } from '@/components/PageTransition';
import { getContent } from '@/content';

export default async function NotFound() {
  const { site } = await getContent();
  return (
    <>
      <Header name={site.name} resume={site.resume} />
      <main id="main" className="relative z-[1]">
        <PageTransition>
          <section className="grid min-h-[80vh] place-items-center pt-32 pb-20">
            <div className="container-x grid justify-items-start gap-6">
              <span className="eyebrow">
                <b>404</b> Page not found
              </span>
              <h1 className="display text-[clamp(40px,6vw,96px)]">
                This page took a <span className="grad">wrong turn.</span>
              </h1>
              <p className="lede">Even the best workflows have edge cases.</p>
              <Link href="/" className="btn btn-primary">
                Back home →
              </Link>
            </div>
          </section>
        </PageTransition>
      </main>
      <Footer />
    </>
  );
}
