import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/dashboard',
        '/admin',
        '/auth',
        '/account',
        '/settings',
        '/checkout/success',
        '/api/private'
      ]
    },
    sitemap: 'https://technic-room.com/sitemap.xml',
    host: 'https://technic-room.com'
  };
}
