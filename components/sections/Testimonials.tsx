import { Reveal } from '@/components/motion/Reveal';
import { testimonials } from '@/lib/site';
import { SectionHeading } from './SectionHeading';

/** Se muestra solo cuando hay testimonios reales cargados en lib/site.ts. */
export function Testimonials({ kicker = 'Clientes' }: { kicker?: string }) {
  if (!testimonials.length) return null;
  return (
    <section aria-labelledby="testimonios-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        <SectionHeading id="testimonios-title" kicker={kicker} title="Lo que dicen los clientes." />
        <ul className="grid gap-4 md:grid-cols-2">
          {testimonials.map((t) => (
            <Reveal as="li" key={t.name} className="rounded-marca border-line border p-6 md:p-8">
              <figure>
                <blockquote className="text-lg md:text-xl">“{t.quote}”</blockquote>
                <figcaption className="text-muted mt-5 text-sm">
                  <strong className="text-fg">{t.name}</strong> · {t.business}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
