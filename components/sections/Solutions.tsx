import { ArrowUpRight, Check, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { always, segments, whatsappUrl } from '@/lib/site';
import { SectionHeading } from './SectionHeading';

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
