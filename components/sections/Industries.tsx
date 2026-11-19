import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { industries, whatsappUrl } from '@/lib/site';
import { SectionHeading } from './SectionHeading';

/** Rubros con los que trabajamos. Los que tienen caso de estudio llevan al caso. */
export function Industries({ kicker = '04 · Rubros' }: { kicker?: string }) {
  return (
    <section aria-labelledby="rubros-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        <SectionHeading
          id="rubros-title"
          kicker={kicker}
          title={
            <>
              Negocios de todo tipo, <span className="hl">una misma idea.</span>
            </>
          }
          lead="Que tus clientes te encuentren, entiendan qué hacés y te escriban. Estos son algunos rubros con los que ya trabajamos."
        />
        <ul className="border-line border-t">
          {industries.map((it) => {
            const row = (
              <>
                <span className="text-[clamp(1.25rem,2.6vw,2rem)] font-extrabold tracking-[-0.035em]">
                  {it.name}
                </span>
                <span className="text-muted hidden text-sm md:block">{it.detail}</span>
                <span className="text-muted group-hover:text-fg flex items-center justify-end gap-1.5 text-sm font-bold transition-colors">
                  {'slug' in it ? 'Ver caso' : 'Consultar'}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </span>
              </>
            );
            const cls =
              'industry-row group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-5 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_auto] md:py-6';
            return (
              <Reveal as="li" key={it.name} className="border-line border-b">
                {'slug' in it ? (
                  <Link href={`/proyectos/${it.slug}`} className={cls}>
                    {row}
                  </Link>
                ) : (
                  <a
                    href={whatsappUrl(`Hola, tengo un negocio de ${it.name.toLowerCase()} y quiero una web`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cls}
                  >
                    {row}
                  </a>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
