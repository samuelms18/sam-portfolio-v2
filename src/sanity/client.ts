import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, sanityConfigured } from './env';

/** Read-only, CDN-backed client for published content. Null until a project ID is set. */
export const client = sanityConfigured ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: 'published' }) : null;
