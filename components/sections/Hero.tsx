import { FileText, MessageCircle } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Frame, Star } from '@/components/brand/Star';
import { Button } from '@/components/ui/button';
import { site, whatsappUrl } from '@/lib/site';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

/** Portada: qué hacemos, para quién, y cómo escribirnos. Corta y directa. */
export function Hero({ projectCount }: { projectCount: number }) {
  const trust = [
    `${projectCount} proyectos en producción`,
    `Respuesta en ${site.responseTime}`,
    'Hablás con quien lo construye',
  ];
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-[6%] -z-10 hidden size-[34rem] rounded-full opacity-[0.13] md:block"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }}
      />
      <div className="wrap grid items-center gap-10 pt-12 pb-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,.6fr)] md:gap-16 md:pt-20 md:pb-24">
        <div className="min-w-0">
          <p className="kicker fade-up" style={i(0)}>
            <span
              className="bg-accent pulse-dot mr-2 inline-block size-2 rounded-full align-middle"
              aria-hidden="true"
            />
            Diseño y desarrollo web · {site.city}, {site.region}
          </p>
          <h1 id="hero-title" className="text-display mt-5 font-extrabold">
            <span className="line-mask">
              <span style={i(0)}>Webs y sistemas</span>
            </span>
            <span className="line-mask">
              <span style={i(1)}>que hacen</span>
            </span>
            <span className="line-mask">
              <span style={i(2)}>
                <span className="hl">trabajar a tu negocio.</span>
              </span>
            </span>
          </h1>
          <p className="text-muted fade-up mt-6 max-w-[52ch] md:mt-8 md:text-lg" style={i(2)}>
            Páginas que consiguen clientes, turnos online que se toman solos y sistemas a medida. Diseñados y
            programados desde {site.city}, para negocios de todo el país.
          </p>
          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10" style={i(3)}>
            <Button asChild>
              <a
                href={whatsappUrl('Hola, quiero una página web para mi negocio')}
                target="_blank"
                rel="noopener noreferrer"
              >
                <MessageCircle aria-hidden="true" /> Escribinos por WhatsApp
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={site.formUrl} target="_blank" rel="noopener noreferrer">
                <FileText aria-hidden="true" /> Completá el formulario
              </a>
            </Button>
          </div>
          <ul className="text-muted fade-up mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm" style={i(4)}>
            {trust.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <Star className="text-accent-ink size-3.5" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="relative order-first aspect-square w-24 sm:w-32 md:order-none md:w-full md:max-w-[24rem] md:justify-self-end"
        >
          <Frame className="text-accent absolute inset-0 size-full opacity-70" strokeWidth={2} />
          <div className="absolute inset-[13%]">
            <Star className="size-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
