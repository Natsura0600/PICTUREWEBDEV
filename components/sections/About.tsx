import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { site, technologies } from '@/lib/site';

/** Presentación personal (sin foto por ahora). */
export function About({ kicker = '05 · El estudio', full = false }: { kicker?: string; full?: boolean }) {
  return (
    <section aria-labelledby="estudio-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap grid gap-10 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] md:gap-16">
        <Reveal>
          <p className="kicker">{kicker}</p>
        </Reveal>
        <Reveal className="min-w-0">
          <h2 id="estudio-title" className="text-h2 font-extrabold">
            Hola, soy {site.founder.name.split(' ')[0]}.{' '}
            <span className="hl">Del otro lado hay una persona.</span>
          </h2>
          <div className="text-muted mt-6 grid max-w-[62ch] gap-4 md:text-lg">
            <p>
              Soy <strong className="text-fg">{site.founder.name}</strong>, desarrollador web y fundador de
              Picture Web Dev. Trabajo desde {site.city} con comercios, profesionales e instituciones que
              necesitan una web que funcione, no un folleto más.
            </p>
            <p>
              Diseño y programo cada proyecto de punta a punta, así que hablás siempre con quien lo construye.
              También desarrollo{' '}
              <Link href="/proyectos/cornerapp" className="text-fg underline underline-offset-3">
                Córner
              </Link>
              , un sistema de turnos para complejos deportivos: la misma base que uso para los sistemas a
              medida.
            </p>
            {full ? (
              <p>
                Mi forma de trabajar es simple: entender bien qué necesita tu negocio, mostrarte avances
                reales en tu celular y quedarme después de publicar, para que la web siga sirviendo mientras
                crecés.
              </p>
            ) : null}
          </div>
          <div className="mt-10">
            <h3 className="kicker">Con qué trabajo</h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {technologies.map((t) => (
                <li key={t} className="border-line rounded-full border px-3.5 py-1.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
