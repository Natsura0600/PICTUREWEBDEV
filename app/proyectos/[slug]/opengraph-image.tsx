import { getProject, getProjectSlugs } from '@/lib/projects';
import { brandOg, ogSize } from '@/lib/og';

export const alt = 'Caso de estudio de Picture Web Dev';
export const size = ogSize;
export const contentType = 'image/png';
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  return brandOg({
    kicker: project ? `Caso de estudio · ${project.meta.kind}` : 'Caso de estudio',
    title: project?.meta.title ?? 'Picture Web Dev',
    sub: project?.meta.summary,
  });
}
