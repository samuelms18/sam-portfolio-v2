import type { StructureResolver } from 'sanity/structure';

/** Sidebar: the profile is a single document; everything else is a list. */
export const structure: StructureResolver = (S) =>
  S.list()
    .title('Portfolio')
    .items([
      S.listItem().title('Profile & site').id('siteSettings').child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.divider(),
      S.documentTypeListItem('project').title('Projects'),
      S.documentTypeListItem('experience').title('Experience'),
      S.documentTypeListItem('education').title('Education'),
    ]);
