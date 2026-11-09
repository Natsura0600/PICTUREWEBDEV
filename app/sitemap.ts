import type { MetadataRoute } from 'next';
import { getProjectSlugs } from '@/lib/projects';
import { absolute } from '@/lib/seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const pages = [
    { path: '/', priority: 1 },
    { path: '/proyectos', priority: 0.9 },
    { path: '/servicios', priority: 0.9 },
    { path: '/estudio', priority: 0.6 },
    { path: '/contacto', priority: 0.8 },
    { path: '/privacidad', priority: 0.2 },
  ];
  return [
    ...pages.map((p) => ({ url: absolute(p.path), lastModified: now, priority: p.priority })),
    ...getProjectSlugs().map((slug) => ({
      url: absolute(`/proyectos/${slug}`),
      lastModified: now,
      priority: 0.7,
    })),
  ];
}
