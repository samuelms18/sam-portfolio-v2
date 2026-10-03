import { defineArrayMember, defineField, defineType } from 'sanity';

/** One document holding everything that isn't a project, job or degree. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Profile & site',
  type: 'document',
  groups: [
    { name: 'profile', title: 'Profile', default: true },
    { name: 'links', title: 'Contact & links' },
    { name: 'about', title: 'About' },
    { name: 'skills', title: 'Skills' },
  ],
  fields: [
    defineField({ name: 'name', type: 'string', group: 'profile', validation: (r) => r.required() }),
    defineField({ name: 'role', type: 'string', group: 'profile', description: 'e.g. UI/UX Designer & UI/UX Developer' }),
    defineField({ name: 'location', type: 'string', group: 'profile' }),
    defineField({ name: 'currently', title: 'Currently at', type: 'string', group: 'profile' }),
    defineField({ name: 'intro', title: 'Headline', type: 'text', rows: 2, group: 'profile' }),
    defineField({ name: 'introAlt', title: 'About page intro', type: 'text', rows: 2, group: 'profile' }),
    defineField({ name: 'support', title: 'Supporting line', type: 'text', rows: 2, group: 'profile' }),
    defineField({ name: 'photo', type: 'image', group: 'profile', options: { hotspot: true }, description: 'Portrait, 3:4, at least 1200 × 1600 px' }),
    defineField({ name: 'email', type: 'string', group: 'links' }),
    defineField({ name: 'resume', type: 'file', group: 'links', options: { accept: 'application/pdf' } }),
    defineField({
      name: 'socials',
      type: 'object',
      group: 'links',
      description: 'Leave empty to hide',
      fields: ['linkedin', 'github', 'behance', 'dribbble'].map((n) => defineField({ name: n, type: 'url' })),
    }),
    defineField({ name: 'bio', type: 'array', group: 'about', of: [defineArrayMember({ type: 'text', rows: 4 })] }),
    defineField({ name: 'domains', title: 'Industries (ticker)', type: 'array', group: 'about', of: [defineArrayMember({ type: 'string' })] }),
    defineField({
      name: 'principles',
      title: 'Design philosophy',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'title', type: 'string' }), defineField({ name: 'text', type: 'text', rows: 3 })] })],
    }),
    defineField({
      name: 'process',
      title: 'Process steps',
      type: 'array',
      group: 'about',
      of: [defineArrayMember({ type: 'object', fields: [defineField({ name: 'step', type: 'string' }), defineField({ name: 'text', type: 'text', rows: 2 })] })],
    }),
    defineField({
      name: 'skills',
      title: 'Skill groups',
      type: 'array',
      group: 'skills',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [defineField({ name: 'group', type: 'string' }), defineField({ name: 'items', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } })],
          preview: { select: { title: 'group' } },
        }),
      ],
    }),
    defineField({ name: 'exploring', title: 'Currently exploring', type: 'array', group: 'skills', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
  ],
  preview: { prepare: () => ({ title: 'Profile & site' }) },
});
