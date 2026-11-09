import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { coverOf, type Project } from '@/lib/projects';
import { ProjectShot, hostOf } from './ProjectShot';

/** headingLevel: h3 dentro de una sección con h2 (inicio), h2 en el listado (/proyectos). */
type Props = { project: Project; index: number; priority?: boolean; headingLevel?: 'h2' | 'h3' };

export function ProjectCard({ project, index, priority, headingLevel: H = 'h3' }: Props) {
  const { slug, meta } = project;
  const n = String(index + 1).padStart(2, '0');
  return (
    <Reveal as="article" className="group min-w-0">
      <Link
        href={`/proyectos/${slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`${meta.title}: ver caso`}
      >
        <ProjectShot
          title={meta.title}
          host={hostOf(meta.url)}
          image={coverOf(project)}
          sizes="(min-width: 1024px) 600px, (min-width: 768px) 50vw, 100vw"
          priority={priority}
          className="group-hover:border-muted [&_img]:ease-out-soft transition-[border-color] duration-300 [&_img]:transition-transform [&_img]:duration-700 group-hover:[&_img]:scale-[1.02]"
        />
        <div className="flex flex-col gap-2 pt-5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <H className="text-xl font-bold tracking-[-0.025em] md:text-2xl">{meta.title}</H>
            <p className="text-muted mt-2 max-w-[52ch] text-[0.9375rem]">{meta.summary}</p>
            <span className="border-line group-hover:border-fg mt-4 inline-flex items-center gap-1.5 border-b pb-1 text-sm font-bold transition-colors">
              Ver caso
              <ArrowUpRight
                className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </div>
          <p className="label-marca text-muted order-first shrink-0 sm:order-none sm:pt-1 sm:text-right">
            {n}
            <br />
            {meta.kind}
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
