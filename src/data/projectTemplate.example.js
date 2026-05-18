// Copy one entry from projectEntries in projectsData.js and edit fields.
// Then add the slug to either inDevelopmentProjectSlugs or completedProjectSlugs.

export const projectTemplateExample = {
  slug: 'example-project-slug',
  title: 'Example Project Title',
  tagline: 'One-line project subtitle',
  year: '2026',
  status: 'In Development', // or 'Completed'
  image: '/media/img/upcoming/example.png',
  heroImage: '/media/img/upcoming/example-hero.png',
  summary: 'Short card summary used in project tiles.',
  overview: [
    'Paragraph 1 for the project detail page.',
    'Paragraph 2 for the project detail page.',
  ],
  highlights: ['Highlight one', 'Highlight two'],
  gallery: [
    { image: '/media/img/upcoming/example-1.png', caption: 'Optional caption text.' },
    { image: '/media/img/upcoming/example-2.png', caption: 'Optional caption text.' },
  ],
  links: [{ label: 'GitHub', href: 'https://github.com/' }],
}
