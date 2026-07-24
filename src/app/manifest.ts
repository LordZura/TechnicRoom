import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Technic Room',
    short_name: 'Technic Room',
    description: 'Professional HVAC and air conditioner services in Georgia.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FBF8F9',
    theme_color: '#8E2A46',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png'
      }
    ]
  };
}

// TODO(seo-assets): Add /public/icon-192.png and /public/icon-512.png if missing.
