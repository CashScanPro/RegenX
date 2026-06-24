import type { MetadataRoute } from 'next';

const SITE_URL = 'https://regenx-phi.vercel.app';

const productSlugs = [
  'bcaa-2-1-1',
  'bcaa-8-1-1-zero-vegan',
  'beauty-shape',
  'bruleur-thermogenique',
  'chocotella',
  'clear-shake',
  'creatine-monohydrate',
  'iron-testo',
  'iso-whey-zero',
  'mass-gainer',
  'needs-pancakes',
  'needs-pure-rice-cream',
  'pack-prise-de-masse',
  'pack-seche-complete',
  'pre-workout-born-of-rage',
  'protein-vegan',
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    '',
    '/pricing',
    '/contact',
    '/terms',
    '/mentions-legales',
    '/privacy',
    '/gdpr',
    '/retractation',
    '/boutique.html',
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.7,
  }));

  for (const slug of productSlugs) {
    entries.push({
      url: `${SITE_URL}/produits/${slug}.html`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.6,
    });
  }

  return entries;
}
