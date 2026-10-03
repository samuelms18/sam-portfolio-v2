'use client';

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { apiVersion, dataset, projectId } from './src/sanity/env';
import { schemaTypes } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';

export default defineConfig({
  name: 'sam-portfolio',
  title: 'Sam · Portfolio',
  basePath: '/studio',
  projectId: projectId || 'unconfigured',
  dataset,
  schema: {
    types: schemaTypes,
    // The profile is a singleton: no "create new" or "duplicate" for it.
    templates: (templates) => templates.filter((t) => t.schemaType !== 'siteSettings'),
  },
  document: {
    actions: (actions, ctx) => (ctx.schemaType === 'siteSettings' ? actions.filter((a) => !['duplicate', 'delete', 'unpublish'].includes(a.action ?? '')) : actions),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
});
