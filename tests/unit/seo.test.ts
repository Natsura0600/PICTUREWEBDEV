import { describe, expect, it } from 'vitest';
import { breadcrumbJsonLd, organizationJsonLd, projectJsonLd } from '@/lib/seo';
import { projectMetaSchema } from '@/lib/schemas';
import { site } from '@/lib/site';

describe('JSON-LD', () => {
  it('describe la organización y a su fundador', () => {
    const [org, person] = organizationJsonLd();
    expect(org?.name).toBe('Picture Web Dev');
    expect(org?.['@type']).toContain('Organization');
    expect(person?.['@type']).toBe('Person');
    expect(person?.name).toBe(site.founder.name);
  });

  it('arma un CreativeWork con URL absoluta para cada proyecto', () => {
    const meta = projectMetaSchema.parse({
      title: 'Quinzo 1',
      client: 'Constructora Quinzo',
      kind: 'Sitio inmobiliario',
      year: 2026,
      summary: 'Sitio para un edificio de departamentos en Luján con plano interactivo por unidad.',
      url: 'https://quinzo.com.ar/',
      stack: ['Next.js'],
      services: ['Diseño web'],
      order: 3,
    });
    const ld = projectJsonLd('quinzo-1', meta);
    expect(ld['@type']).toBe('CreativeWork');
    expect(ld.url).toBe(`${site.url}/proyectos/quinzo-1`);
    expect(ld.sourceOrganization).toEqual({ '@type': 'Organization', name: 'Constructora Quinzo' });
  });

  it('numera las migas de pan desde 1', () => {
    const ld = breadcrumbJsonLd([
      { name: 'Inicio', path: '/' },
      { name: 'Proyectos', path: '/proyectos' },
    ]);
    const items = ld.itemListElement as { position: number; item: string }[];
    expect(items.map((i) => i.position)).toEqual([1, 2]);
    expect(items[0]?.item).toBe(site.url);
  });
});

describe('projectMetaSchema', () => {
  it('rechaza un proyecto sin url válida', () => {
    const r = projectMetaSchema.safeParse({ title: 'X', url: 'no-es-url' });
    expect(r.success).toBe(false);
  });
});
