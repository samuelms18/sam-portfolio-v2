import type { Metadata, Viewport } from 'next';
import { JetBrains_Mono, Manrope, Syne } from 'next/font/google';
import { getContent } from '@/content';
import './globals.css';

const syne = Syne({ variable: '--font-syne', subsets: ['latin'], weight: ['600', '700', '800'] });
const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });
const jetbrains = JetBrains_Mono({ variable: '--font-jetbrains', subsets: ['latin'], weight: ['400', '500'] });

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getContent();
  return {
    metadataBase: new URL(site.url),
    title: { default: `${site.name} — ${site.role}`, template: `%s — ${site.name}` },
    description: site.intro,
    openGraph: { title: `${site.name} — ${site.role}`, description: site.intro, type: 'website', images: [site.photo] },
    twitter: { card: 'summary_large_image' },
  };
}

export const viewport: Viewport = { themeColor: '#050c0b', viewportFit: 'cover' };

// Runs before first paint: applies the saved theme, and marks a first visit so the preloader
// shows (never on the /studio dashboard).
const bootScript = `(function(){var d=document.documentElement;try{if(localStorage.getItem('theme')==='light')d.dataset.theme='light'}catch(e){}
try{if(location.pathname.indexOf('/studio')!==0&&!sessionStorage.getItem('loaded')&&!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('is-loading');setTimeout(function(){d.classList.remove('is-loading')},5000)}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${manrope.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
