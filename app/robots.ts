import type { MetadataRoute } from 'next';

const SITE_URL = 'https://regenx-phi.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/account',
        '/api',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/auth',
        '/panier.html',
        '/cart',
        '/success.html',
        '/cancel.html',
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
