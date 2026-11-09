import { Reveal } from '@/components/motion/Reveal';
import { services } from '@/lib/site';
import { SectionHeading } from './SectionHeading';

export function Services({
  kicker = '02 · Servicios',
  withHeading = true,
}: {
  kicker?: string;
  withHeading?: boolean;
}) {
  return (
    <section aria-labelledby="servicios-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        {withHeading ? (
          <SectionHeading
            id="servicios-title"
            kicker={kicker}
            title={
              <>
                La tecnología tiene que trabajar <span className="text-muted">para vos.</span>
              </>
            }
            lead="Elegimos la solución según el problema, no al revés. Cada proyecto se piensa para ser claro, útil y fácil de mantener."
          />
        ) : (
          <h2 id="servicios-title" className="sr-only">
            Servicios
          </h2>
        )}
        <ul className="border-line grid border-t border-l md:grid-cols-3">
          {services.map((s, i) => (
            <Reveal
              as="li"
              key={s.id}
              delay={i * 0.06}
              className="border-line flex min-w-0 flex-col border-r border-b p-6 md:p-8"
            >
              <span className="label-marca text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-10 text-2xl font-bold tracking-[-0.025em] md:mt-14">{s.title}</h3>
              <p className="text-muted mt-3 text-[0.9375rem]">{s.text}</p>
              <ul className="border-line mt-6 grid gap-2 border-t pt-5 text-sm">
                {s.items.map((it) => (
                  <li
                    key={it}
                    className="relative pl-5 before:absolute before:top-[.7em] before:left-0 before:h-0.5 before:w-2.5 before:bg-current"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
