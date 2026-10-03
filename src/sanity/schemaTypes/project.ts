import { defineArrayMember, defineField, defineType } from 'sanity';

const MOCKS = ['dashboard', 'planner', 'mobile', 'commerce', 'portal', 'form'];

/** A case study. Real screenshots (cover + screens) replace the drawn illustration when added. */
export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  groups: [
    { name: 'card', title: 'Card', default: true },
    { name: 'images', title: 'Images' },
    { name: 'story', title: 'Case study' },
  ],
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'card', validation: (r) => r.required() }),
    defineField({ name: 'subtitle', type: 'string', group: 'card' }),
    defineField({ name: 'slug', type: 'slug', group: 'card', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'order', type: 'number', group: 'card', description: 'Lower numbers show first' }),
    defineField({ name: 'summary', type: 'text', rows: 2, group: 'card' }),
    defineField({ name: 'category', title: 'Filters', type: 'array', group: 'card', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'role', type: 'string', group: 'card' }),
    defineField({ name: 'tools', type: 'array', group: 'card', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'domain', type: 'string', group: 'card' }),
    defineField({ name: 'platform', type: 'string', group: 'card' }),
    defineField({ name: 'focus', type: 'array', group: 'card', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'hue', title: 'Accent hue (0–360)', type: 'number', group: 'card', validation: (r) => r.min(0).max(360) }),
    defineField({ name: 'cover', title: 'Cover screenshot', type: 'image', group: 'images', options: { hotspot: true }, description: '16:10, at least 2400 px wide. Blur confidential data.' }),
    defineField({
      name: 'screens',
      title: 'More screens',
      type: 'array',
      group: 'images',
      of: [defineArrayMember({ type: 'image', options: { hotspot: true }, fields: [defineField({ name: 'alt', type: 'string' }), defineField({ name: 'caption', type: 'string' })] })],
    }),
    defineField({ name: 'mock', title: 'Illustration (used without screenshots)', type: 'string', group: 'images', options: { list: MOCKS } }),
    defineField({ name: 'context', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'problem', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'myRole', title: 'My role', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'understanding', title: 'Research & understanding', type: 'array', group: 'story', of: [defineArrayMember({ type: 'text', rows: 2 })] }),
    defineField({ name: 'process', title: 'UX process', type: 'array', group: 'story', of: [defineArrayMember({ type: 'text', rows: 2 })] }),
    defineField({ name: 'wireframes', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'visual', title: 'Visual design', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'prototype', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'development', type: 'text', rows: 3, group: 'story' }),
    defineField({ name: 'outcome', title: 'Results', type: 'array', group: 'story', of: [defineArrayMember({ type: 'text', rows: 2 })] }),
    defineField({ name: 'learnings', type: 'text', rows: 3, group: 'story' }),
  ],
  preview: { select: { title: 'title', subtitle: 'subtitle', media: 'cover' } },
});
