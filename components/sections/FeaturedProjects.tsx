import Link from 'next/link';
import { ProjectCard } from '@/components/project/ProjectCard';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/projects';
import { SectionHeading } from './SectionHeading';

export function FeaturedProjects({ projects }: { projects: Project[] }) {
  const featured = projects.filter((p) => p.meta.featured);
  const list = featured.length ? featured : projects.slice(0, 4);
  return (
    <section aria-labelledby="proyectos-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        <SectionHeading
          id="proyectos-title"
          kicker="01 · Proyectos"
          title={
            <>
              Trabajo real, <span className="text-muted">en producción.</span>
            </>
          }
          lead="Sistemas y sitios que hoy usan negocios de verdad. Cada caso cuenta qué problema había y cómo lo resolvimos."
        />
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {list.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} priority={i < 2} />
          ))}
        </div>
        <div className="mt-14 flex justify-center">
          <Button asChild variant="outline">
            <Link href="/proyectos">Ver todos los proyectos ({projects.length})</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
