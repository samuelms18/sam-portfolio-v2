import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope, Syne } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { Preloader } from '@/components/Preloader';
import { Spotlight } from '@/components/Spotlight';
import { site } from '@/content/data';
import './globals.css';

const syne = Syne({ variable: '--font-syne', subsets: ['latin'], weight: ['600', '700', '800'] });
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], weight: ['400', '500'] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
  description: site.intro,
  openGraph: { title: `${site.name} — ${site.role}`, description: site.intro, type: 'website', images: [site.photo] },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#050c0b', viewportFit: 'cover' };

// Runs before first paint: applies the saved theme, and marks a first visit so the preloader shows.
const bootScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem('theme')==='light')d.dataset.theme='light'}catch(e){}
try{if(!sessionStorage.getItem('loaded')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('is-loading');setTimeout(function(){d.classList.remove('is-loading')},5000)}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[200] focus:rounded-full focus:bg-[var(--teal)] focus:px-4 focus:py-2 focus:text-[var(--ink-on-light)]"
        >
          Skip to content
        </a>
        <Preloader />
        <Spotlight />
        <div className="grain" aria-hidden="true" />
        <Header />
        <main id="main" className="relative z-[1]">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
