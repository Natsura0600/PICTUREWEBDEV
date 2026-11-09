import { ProjectCard } from '@/components/project/ProjectCard';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { getProjects } from '@/lib/projects';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Proyectos',
  description:
    'Casos de estudio de Picture Web Dev: sistemas de turnos, sitios inmobiliarios, institucionales y portales. Qué problema había y cómo lo resolvimos.',
  path: '/proyectos',
});

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <>
      <section className="wrap pt-14 pb-20 md:pt-20 md:pb-28">
        <SectionHeading
          as="h1"
          kicker="Proyectos"
          title={
            <>
              Ideas que ya son <span className="hl">herramientas.</span>
            </>
          }
          lead="Cada proyecto empezó con un problema concreto de un negocio. Entrá a cada caso para ver cómo lo resolvimos."
        />
        <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} priority={i < 2} headingLevel="h2" />
          ))}
        </div>
      </section>
      <ContactCTA />
    </>
  );
}
