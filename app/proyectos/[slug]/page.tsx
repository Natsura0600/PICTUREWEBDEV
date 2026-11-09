import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Reveal } from '@/components/motion/Reveal';
import { Gallery } from '@/components/project/Gallery';
import { ProjectShot, hostOf } from '@/components/project/ProjectShot';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { JsonLd } from '@/components/seo/JsonLd';
import { Button } from '@/components/ui/button';
import { coverOf, getProject, getProjectSlugs, getProjects } from '@/lib/projects';
import { breadcrumbJsonLd, pageMetadata, projectJsonLd } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

/** Todas las páginas de proyecto se generan en el build; un slug desconocido da 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};
  return pageMetadata({
    title: `${project.meta.title} · ${project.meta.kind}`,
    description: project.meta.summary,
    path: `/proyectos/${slug}`,
    image: null,
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const { meta, Content, images } = project;

  const all = await getProjects();
  const idx = all.findIndex((p) => p.slug === slug);
  const next = all[(idx + 1) % all.length];

  const facts: [string, string][] = [
    ['Cliente', meta.client],
    ['Tipo', meta.kind],
    ['Año', String(meta.year)],
    ['Lugar', meta.location],
  ];

  return (
    <>
      <article className="wrap pt-10 pb-20 md:pt-14 md:pb-28">
        <nav aria-label="Ruta" className="mb-10">
          <Link
            href="/proyectos"
            className="text-muted hover:text-fg inline-flex items-center gap-2 text-sm font-semibold"
          >
            <ArrowLeft className="size-4" aria-hidden="true" /> Todos los proyectos
          </Link>
        </nav>

        <header className="grid gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] md:gap-16">
          <div className="min-w-0">
            <p className="kicker">{meta.kind}</p>
            <h1 className="text-display mt-4 font-extrabold">{meta.title}</h1>
            <p className="text-muted mt-6 max-w-[56ch] md:text-lg">{meta.summary}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild>
                <a href={meta.url} target="_blank" rel="noopener noreferrer">
                  Visitar {hostOf(meta.url)} <ArrowUpRight aria-hidden="true" />
                </a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/contacto">Quiero algo así</Link>
              </Button>
            </div>
          </div>
          <Reveal delay={0.08}>
            <dl className="border-line grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-6">
              {facts.map(([k, v]) => (
                <div key={k} className="min-w-0">
                  <dt className="kicker">{k}</dt>
                  <dd className="mt-1 font-semibold">{v}</dd>
                </div>
              ))}
              <div className="col-span-2">
                <dt className="kicker">Qué hicimos</dt>
                <dd className="mt-1 font-semibold">{meta.services.join(' · ')}</dd>
              </div>
              <div className="col-span-2">
                <dt className="kicker">Tecnología</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {meta.stack.map((t) => (
                    <span key={t} className="border-line rounded-full border px-3 py-1 text-sm">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
        </header>

        <div className="mt-12 md:mt-16">
          {images.length ? (
            <Gallery images={images} title={meta.title} />
          ) : (
            <ProjectShot
              title={meta.title}
              host={hostOf(meta.url)}
              url={meta.url}
              transitionName={`shot-${slug}`}
              image={coverOf(project)}
              sizes="(min-width: 1280px) 1240px, 100vw"
              priority
            />
          )}
        </div>

        <div className="mt-14 grid gap-12 md:mt-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] md:gap-16">
          <div className="prose-caso min-w-0 [&>h2:first-child]:mt-0">
            <Content />
          </div>
          {meta.results.length ? (
            <aside
              aria-labelledby="resuelve-title"
              className="rounded-marca border-line self-start border p-6 md:sticky md:top-24"
            >
              <h2 id="resuelve-title" className="kicker">
                Lo que resuelve
              </h2>
              <ul className="mt-4 grid gap-4">
                {meta.results.map((r) => (
                  <li key={r} className="border-line border-t pt-4 font-semibold">
                    {r}
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>

        {next && next.slug !== slug ? (
          <nav aria-label="Siguiente proyecto" className="border-line mt-20 border-t pt-8 md:mt-28">
            <Link href={`/proyectos/${next.slug}`} className="group flex items-end justify-between gap-6">
              <span>
                <span className="kicker block">Siguiente proyecto</span>
                <span className="text-h2 mt-2 block font-extrabold">{next.meta.title}</span>
              </span>
              <ArrowUpRight
                className="size-8 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                aria-hidden="true"
              />
            </Link>
          </nav>
        ) : null}
      </article>
      <ContactCTA />
      <JsonLd data={projectJsonLd(slug, meta)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Proyectos', path: '/proyectos' },
          { name: meta.title, path: `/proyectos/${slug}` },
        ])}
      />
    </>
  );
}
