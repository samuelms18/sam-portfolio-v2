/** Sanity connection. Empty project ID = the site uses the built-in content in src/content/data.ts. */
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? '';
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
export const apiVersion = '2025-10-01';
export const sanityConfigured = /^[a-z0-9-]+$/.test(projectId);
