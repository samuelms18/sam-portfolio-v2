import 'server-only';
import { cache } from 'react';
import { client } from '@/sanity/client';
import * as local from './data';
import type { Content, Education, Experience, Project, Site } from './types';

const LOCAL: Content = {
  site: local.site,
  bio: local.bio,
  domains: local.domains,
  principles: local.principles,
  process: local.process,
  skills: local.skills,
  exploring: local.exploring,
  experience: local.experience,
  education: local.education,
  projects: local.projects,
};

const QUERY = `{
  "settings": *[_id == "siteSettings"][0]{
    ..., "photo": photo.asset->url, "resume": resume.asset->url
  },
  "projects": *[_type == "project" && defined(slug.current)] | order(coalesce(order, 999) asc, _createdAt asc){
    ..., "slug": slug.current, "cover": cover.asset->url,
    "screens": screens[]{ "src": asset->url, alt, caption }
  },
  "experience": *[_type == "experience"] | order(coalesce(order, 999) asc, _createdAt asc),
  "education": *[_type == "education"] | order(coalesce(order, 999) asc, _createdAt asc)
}`;

type Raw = {
  settings: (Partial<Site> & { bio?: string[]; domains?: string[]; principles?: Content['principles']; process?: Content['process']; skills?: Content['skills']; exploring?: string[] }) | null;
  projects: Partial<Project>[];
  experience: Partial<Experience>[];
  education: Partial<Education>[];
};

/** Drops null/empty values so missing fields fall back to the built-in content. */
function clean<T extends object>(o: T | null | undefined): Partial<T> {
  if (!o) return {};
  return Object.fromEntries(Object.entries(o).filter(([k, v]) => !k.startsWith('_') && v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && !v.length))) as Partial<T>;
}

const nonEmpty = <T,>(arr: T[] | undefined, fallback: T[]) => (arr && arr.length ? arr : fallback);

function merge(raw: Raw): Content {
  const s = clean(raw.settings);
  const site: Site = { ...LOCAL.site, ...s, socials: { ...LOCAL.site.socials, ...clean(raw.settings?.socials) } };
  const projects = raw.projects.map((p): Project => {
    const base = LOCAL.projects.find((l) => l.slug === p.slug);
    const c = clean(p);
    return {
      ...(base ?? { category: [], tools: [], focus: [], understanding: [], process: [], outcome: [], mock: 'dashboard', hue: 170, context: '', problem: '', myRole: '', learnings: '', summary: '', subtitle: '', role: '', domain: '', platform: '' }),
      ...c,
    } as Project;
  });
  return {
    site,
    bio: nonEmpty(s.bio, LOCAL.bio),
    domains: nonEmpty(s.domains, LOCAL.domains),
    principles: nonEmpty(s.principles, LOCAL.principles),
    process: nonEmpty(s.process, LOCAL.process),
    skills: nonEmpty(s.skills, LOCAL.skills),
    exploring: nonEmpty(s.exploring, LOCAL.exploring),
    experience: nonEmpty(raw.experience.map((e) => clean(e) as Experience), LOCAL.experience),
    education: nonEmpty(raw.education.map((e) => clean(e) as Education), LOCAL.education),
    projects: nonEmpty(projects, LOCAL.projects),
  };
}

let warned = false;

/**
 * All portfolio content. Reads Sanity when NEXT_PUBLIC_SANITY_PROJECT_ID is set
 * (refreshed at most every 60 s); otherwise, or if Sanity is unreachable, uses src/content/data.ts.
 */
export const getContent = cache(async (): Promise<Content> => {
  if (!client) return LOCAL;
  try {
    const raw = await client.fetch<Raw>(QUERY, {}, { next: { revalidate: 60, tags: ['content'] } });
    return merge(raw);
  } catch (err) {
    if (!warned) {
      warned = true;
      const msg = (err as Error).message.replace(/GET-request to \S+ /, '');
      console.warn(`[content] Sanity unavailable, using built-in content (${msg.slice(0, 140)})`);
    }
    return LOCAL;
  }
});
