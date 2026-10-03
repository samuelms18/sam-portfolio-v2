import { defineArrayMember, defineField, defineType } from 'sanity';

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'document',
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  fields: [
    defineField({ name: 'company', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string' }),
    defineField({ name: 'period', type: 'string', description: 'e.g. 2025 — Present, or 8 months' }),
    defineField({ name: 'text', title: 'Description', type: 'text', rows: 3 }),
    defineField({ name: 'highlights', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
    defineField({ name: 'order', type: 'number', description: 'Lower numbers show first' }),
  ],
  preview: { select: { title: 'company', subtitle: 'role' } },
});

export const education = defineType({
  name: 'education',
  title: 'Education',
  type: 'document',
  orderings: [{ title: 'Display order', name: 'order', by: [{ field: 'order', direction: 'asc' }] }],
  fields: [
    defineField({ name: 'title', title: 'Degree', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'place', title: 'Institution', type: 'string' }),
    defineField({ name: 'year', type: 'string' }),
    defineField({ name: 'grade', type: 'string' }),
    defineField({ name: 'order', type: 'number' }),
  ],
  preview: { select: { title: 'title', subtitle: 'place' } },
});
