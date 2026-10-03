import { NextStudio } from 'next-sanity/studio';
import config from '../../../../sanity.config';
import { sanityConfigured } from '@/sanity/env';

export const dynamic = 'force-static';
export { metadata, viewport } from 'next-sanity/studio';

export default function StudioPage() {
  if (!sanityConfigured) {
    return (
      <main style={{ minHeight: '100svh', display: 'grid', placeItems: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ maxWidth: 520, lineHeight: 1.6 }}>
          <h1 style={{ fontSize: 28, marginBottom: 12 }}>Content dashboard isn&apos;t connected yet</h1>
          <p>
            Create a free project at <a href="https://www.sanity.io/manage">sanity.io/manage</a>, then add its project ID as{' '}
            <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in Vercel → Settings → Environment Variables and redeploy. See the README for the full steps.
          </p>
        </div>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
