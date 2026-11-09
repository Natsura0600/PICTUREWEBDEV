import type { Metadata } from 'next';
import type { ProjectMeta } from './schemas';
import { faqs, site } from './site';

export const absolute = (path = '/'): string => `${site.url}${path === '/' ? '' : path}`;

type PageMeta = {
  title: string;
  description: string;
  path: string;
  /**
   * Imagen para redes. Por defecto, la general del sitio. `null` cuando la ruta tiene su propio
   * opengraph-image.tsx (los casos de estudio): Next la agrega sola y no hay que pisarla.
   */
  image?: string | null;
};

/** Metadata consistente por página: título, canónica, Open Graph y Twitter. */
export function pageMetadata({ title, description, path, image = '/opengraph-image' }: PageMeta): Metadata {
  const og = {
    title,
    description,
    url: path,
    type: 'website' as const,
    locale: site.locale,
    siteName: site.name,
  };
  const tw = { card: 'summary_large_image' as const, title, description };
  if (image === null)
    return { title, description, alternates: { canonical: path }, openGraph: og, twitter: tw };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      ...og,
      images: [{ url: image, width: 1200, height: 630, alt: `${site.name}: ${site.tagline}` }],
    },
    twitter: { ...tw, images: [image] },
  };
}

type JsonLd = Record<string, unknown>;

const orgId = `${site.url}/#organizacion`;
const personId = `${site.url}/#fundador`;

export function organizationJsonLd(): JsonLd[] {
  return [
    {
      '@context': 'https://schema.org',
      '@type': ['Organization', 'ProfessionalService'],
      '@id': orgId,
      name: site.name,
      slogan: site.tagline,
      description: site.description,
      url: site.url,
      logo: absolute('/brand/favicon-512.png'),
      image: absolute('/brand/og-image.png'),
      telephone: `+${site.whatsapp.number}`,
      address: {
        '@type': 'PostalAddress',
        addressLocality: site.city,
        addressRegion: site.region,
        addressCountry: site.country,
      },
      areaServed: [
        { '@type': 'City', name: site.city },
        { '@type': 'Country', name: 'Argentina' },
      ],
      founder: { '@id': personId },
      sameAs: site.socials.map((s) => s.href),
      priceRange: 'USD 150 – USD 300+',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Person',
      '@id': personId,
      name: site.founder.name,
      jobTitle: site.founder.role,
      worksFor: { '@id': orgId },
      address: { '@type': 'PostalAddress', addressLocality: site.city, addressCountry: site.country },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: site.name,
      url: site.url,
      inLanguage: 'es-AR',
      publisher: { '@id': orgId },
    },
  ];
}

export function projectJsonLd(slug: string, meta: ProjectMeta): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: meta.title,
    headline: `${meta.title}: ${meta.kind}`,
    description: meta.summary,
    url: absolute(`/proyectos/${slug}`),
    sameAs: meta.url,
    dateCreated: String(meta.year),
    inLanguage: 'es-AR',
    keywords: [...meta.services, ...meta.stack].join(', '),
    creator: { '@id': orgId },
    image: absolute(`/proyectos/${slug}/opengraph-image`),
    ...(meta.client !== 'Producto propio'
      ? { sourceOrganization: { '@type': 'Organization', name: meta.client } }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absolute(it.path),
    })),
  };
}

export function faqJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
