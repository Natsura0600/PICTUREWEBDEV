import { ArrowUpRight, Bot, Check, MessageCircle } from 'lucide-react';
import type { ComponentProps } from 'react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { addons, always, segments, whatsappUrl } from '@/lib/site';
import { SectionHeading } from './SectionHeading';

/** Ícono de Instagram (lucide ya no incluye logos de marcas). */
function Instagram(props: ComponentProps<'svg'>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}

/**
 * Segmentación para vender: cada tipo de cliente encuentra su camino, con lo que incluye,
 * un ejemplo real y un WhatsApp con el mensaje ya escrito para su caso.
 */
export function Solutions() {
  return (
    <section
      id="soluciones"
      aria-labelledby="soluciones-title"
      className="border-line border-t py-20 md:py-28"
    >
      <div className="wrap">
        <SectionHeading
          id="soluciones-title"
          kicker="01 · Soluciones"
          title={
            <>
              ¿Qué necesita <span className="hl">tu negocio?</span>
            </>
          }
          lead="Elegí lo que más se parece a lo tuyo. Te mostramos un trabajo real y te escribimos una propuesta a medida, sin compromiso."
        />
        <ul className="grid gap-4 lg:grid-cols-3">
          {segments.map((s, i) => (
            <Reveal
              as="li"
              key={s.id}
              delay={i * 0.05}
              data-spotlight
              className="spot-card rounded-marca border-line bg-surface flex min-w-0 flex-col border p-6 md:p-8"
            >
              <span className="label-marca text-accent-ink">{s.tag}</span>
              <h3 className="mt-4 text-2xl font-bold tracking-[-0.03em]">{s.title}</h3>
              <p className="text-muted mt-2 text-[0.9375rem]">{s.for}</p>
              <ul className="border-line mt-6 grid gap-2.5 border-t pt-5 text-[0.9375rem]">
                {s.items.map((it) => (
                  <li key={it} className="flex gap-2.5">
                    <Check className="text-accent-ink mt-1 size-4 shrink-0" aria-hidden="true" />
                    {it}
                  </li>
                ))}
              </ul>
              <p className="text-muted mt-auto pt-6 text-sm">
                Mirá cómo quedó:{' '}
                {s.examples.map((ex, k) => (
                  <span key={ex.slug}>
                    {k > 0 ? ' · ' : null}
                    <Link
                      href={`/proyectos/${ex.slug}`}
                      className="text-fg group inline-flex items-center gap-0.5 font-bold underline decoration-[var(--line)] underline-offset-4 hover:decoration-current"
                    >
                      {ex.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </Link>
                  </span>
                ))}
              </p>
              <Button asChild className="mt-5 w-full" variant={i === 1 ? 'primary' : 'outline'}>
                <a href={whatsappUrl(s.message)} target="_blank" rel="noopener noreferrer">
                  <MessageCircle aria-hidden="true" /> {s.cta}
                </a>
              </Button>
            </Reveal>
          ))}
        </ul>
        <div className="mt-10">
          <p className="kicker">Sumá a tu negocio</p>
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {addons.map((a, i) => {
              const Icon = a.id === 'instagram' ? Instagram : Bot;
              return (
                <Reveal
                  as="li"
                  key={a.id}
                  delay={i * 0.05}
                  data-spotlight
                  className="spot-card rounded-marca border-line bg-surface grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-5 gap-y-4 border p-6"
                >
                  <span className="border-line text-accent-ink grid size-12 shrink-0 place-items-center rounded-xl border">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold tracking-[-0.02em]">
                      <a href={`/servicios#${a.id}`} className="hover:underline hover:underline-offset-4">
                        {a.title}
                      </a>
                    </h3>
                    <p className="text-muted mt-1 text-[0.9375rem]">{a.text}</p>
                  </div>
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="col-span-2 w-full sm:col-span-1 sm:col-start-2 sm:w-auto sm:justify-self-start"
                  >
                    <a href={whatsappUrl(a.message)} target="_blank" rel="noopener noreferrer">
                      <MessageCircle aria-hidden="true" /> {a.cta}
                    </a>
                  </Button>
                </Reveal>
              );
            })}
          </ul>
        </div>
        <div className="border-line mt-6 flex flex-col gap-3 rounded-2xl border px-5 py-4 text-sm md:flex-row md:items-center md:gap-6">
          <p className="font-bold whitespace-nowrap">En todos los proyectos:</p>
          <ul className="text-muted flex flex-wrap gap-x-5 gap-y-2">
            {always.map((a) => (
              <li key={a} className="flex items-center gap-2">
                <Check className="text-accent-ink size-4" aria-hidden="true" />
                {a}
              </li>
            ))}
          </ul>
          <Link
            href="/servicios"
            className="text-fg font-bold whitespace-nowrap underline underline-offset-4 md:ml-auto"
          >
            Ver detalle
          </Link>
        </div>
      </div>
    </section>
  );
}
