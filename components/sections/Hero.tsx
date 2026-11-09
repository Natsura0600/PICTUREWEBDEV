import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties } from 'react';
import { Tagline, Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';
import { HeroStarLazy } from './HeroStarLazy';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="wrap relative pt-12 pb-10 md:pt-20 md:pb-14">
      {/* Halo de acento detrás de la estrella */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-0 -z-10 hidden size-[34rem] rounded-full opacity-[0.12] md:block"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }}
      />
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,.6fr)] md:gap-16">
        <div className="min-w-0">
          <p className="kicker fade-up" style={i(0)}>
            <span
              className="bg-accent mr-2 inline-block size-2 rounded-full align-middle"
              aria-hidden="true"
            />
            Estudio de diseño y desarrollo web · {site.city}, {site.region}
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
                <span className="hl">trabajar a tu</span>
              </span>
            </span>
            <span className="line-mask">
              <span style={i(3)}>
                <span className="hl">negocio.</span>
              </span>
            </span>
          </h1>
          <p className="text-muted fade-up mt-6 max-w-[54ch] md:mt-8 md:text-lg" style={i(2)}>
            Diseñamos páginas web, turnos online y paneles a medida para negocios que quieren vender más y
            perder menos tiempo. Desde Luján, para todo el país.
          </p>
          <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row md:mt-10" style={i(3)}>
            <Button asChild>
              <Link href="/contacto">
                Pedí tu propuesta <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/proyectos">Ver proyectos</Link>
            </Button>
          </div>
          <p className="text-muted fade-up mt-4 text-sm" style={i(4)}>
            Te respondemos en {site.responseTime}.
          </p>
        </div>
        <div className="order-first w-28 sm:w-36 md:order-none md:w-full md:max-w-[26rem] md:justify-self-end">
          <HeroStarLazy />
        </div>
      </div>
      <div className="border-line mt-14 flex items-end justify-between gap-4 border-t pt-5 md:mt-20">
        <Wordmark />
        <p className="text-muted hidden text-[0.8125rem] md:block">
          Páginas web · Sistemas a medida · Mantenimiento
        </p>
        <Tagline className="text-right" />
      </div>
    </section>
  );
}
