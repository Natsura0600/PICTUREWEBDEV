import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import type { ComponentType } from 'react';
import { z } from 'zod';
import { projectMetaSchema, type ProjectMeta } from './schemas';

const CONTENT_DIR = path.join(process.cwd(), 'content', 'proyectos');
const MEDIA_DIR = path.join(process.cwd(), 'public', 'proyectos');

const mediaSchema = z.object({
  images: z.array(
    z.object({
      src: z.string().startsWith('/proyectos/'),
      width: z.number().int().positive(),
      height: z.number().int().positive(),
      blur: z.string().startsWith('data:image/'),
      device: z.enum(['desktop', 'mobile']),
      alt: z.string().min(1),
    }),
  ),
});

export type ProjectImage = z.infer<typeof mediaSchema>['images'][number];

export type Project = {
  slug: string;
  meta: ProjectMeta;
  images: ProjectImage[];
};

export type ProjectWithContent = Project & { Content: ComponentType };

/** Lista los slugs a partir de los archivos .mdx (la fuente de verdad es la carpeta). */
export function getProjectSlugs(): string[] {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
    .sort();
}

/** Capturas generadas por `npm run capturas`. Si todavía no existen, el sitio muestra un marco de marca. */
function getImages(slug: string): ProjectImage[] {
  const file = path.join(MEDIA_DIR, slug, 'media.json');
  if (!fs.existsSync(file)) return [];
  const parsed = mediaSchema.safeParse(JSON.parse(fs.readFileSync(file, 'utf8')));
  if (!parsed.success) {
    console.warn(`media.json inválido en ${slug}: se ignoran las capturas`);
    return [];
  }
  return parsed.data.images;
}

async function load(slug: string): Promise<ProjectWithContent | null> {
  if (!/^[a-z0-9-]+$/.test(slug) || !getProjectSlugs().includes(slug)) return null;
  const mod: { default: ComponentType; meta?: unknown } = await import(`@/content/proyectos/${slug}.mdx`);
  const parsed = projectMetaSchema.safeParse(mod.meta);
  if (!parsed.success) {
    // Fallar fuerte en el build: un proyecto mal cargado no se publica en silencio
    throw new Error(`El proyecto "${slug}" tiene datos inválidos: ${parsed.error.message}`);
  }
  return { slug, meta: parsed.data, images: getImages(slug), Content: mod.default };
}

export async function getProject(slug: string): Promise<ProjectWithContent | null> {
  return load(slug);
}

export async function getProjects(): Promise<Project[]> {
  const all = await Promise.all(getProjectSlugs().map((s) => load(s)));
  return all
    .filter((p): p is ProjectWithContent => p !== null)
    .map(({ slug, meta, images }) => ({ slug, meta, images }))
    .sort((a, b) => a.meta.order - b.meta.order);
}

export function coverOf(p: Project): ProjectImage | undefined {
  return p.images.find((i) => i.device === 'desktop') ?? p.images[0];
}
