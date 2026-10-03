// One-time import of the built-in content (src/content/data.ts) into your Sanity project.
//
//   NEXT_PUBLIC_SANITY_PROJECT_ID=xxxx SANITY_API_WRITE_TOKEN=yyyy node scripts/seed-sanity.mjs
//   node scripts/seed-sanity.mjs --dry-run      # print what would be written
//
// Safe to re-run: documents use fixed IDs and are replaced, not duplicated.
import { createClient } from '@sanity/client';
import { readFileSync } from 'node:fs';
import { basename, join } from 'node:path';
import * as c from '../src/content/data.ts';

const dry = process.argv.includes('--dry-run');
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!dry && (!projectId || !token)) {
  console.error('Set NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN (an Editor token from sanity.io/manage → API → Tokens).');
  process.exit(1);
}
const client = dry ? null : createClient({ projectId, dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production', apiVersion: '2025-10-01', token, useCdn: false });

const key = (i) => `k${i}`;
const withKeys = (arr = []) => arr.map((v, i) => (typeof v === 'object' ? { _key: key(i), ...v } : v));

async function upload(publicPath) {
  if (!publicPath) return undefined;
  if (dry) return { _type: 'image', asset: { _ref: `image-from:${publicPath}` } };
  const file = readFileSync(join('public', publicPath));
  const asset = await client.assets.upload('image', file, { filename: basename(publicPath) });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

const { site } = c;
const docs = [
  {
    _id: 'siteSettings',
    _type: 'siteSettings',
    name: site.name,
    role: site.role,
    location: site.location,
    currently: site.currently,
    intro: site.intro,
    introAlt: site.introAlt,
    support: site.support,
    photo: await upload(site.photo),
    email: site.email,
    socials: Object.fromEntries(Object.entries(site.socials).filter(([, v]) => v)),
    bio: c.bio,
    domains: c.domains,
    principles: withKeys(c.principles),
    process: withKeys(c.process),
    skills: withKeys(c.skills),
    exploring: c.exploring,
  },
  ...c.projects.map((p, i) => ({
    _id: `project-${p.slug}`,
    _type: 'project',
    ...p,
    slug: { _type: 'slug', current: p.slug },
    order: i + 1,
  })),
  ...c.experience.map((e, i) => ({ _id: `experience-${i + 1}`, _type: 'experience', ...e, order: i + 1 })),
  ...c.education.map((e, i) => ({ _id: `education-${i + 1}`, _type: 'education', ...e, order: i + 1 })),
];

if (dry) {
  for (const d of docs) console.log(`${d._type.padEnd(13)} ${d._id}`);
  console.log(`\n${docs.length} documents would be written (dry run).`);
} else {
  const tx = client.transaction();
  docs.forEach((d) => tx.createOrReplace(d));
  await tx.commit();
  console.log(`Imported ${docs.length} documents into Sanity. Open /studio to edit them.`);
}
