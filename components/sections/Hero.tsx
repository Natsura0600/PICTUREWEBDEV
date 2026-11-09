import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Tagline, Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/button';
import { site } from '@/lib/site';
import { HeroStarLazy } from './HeroStarLazy';

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="wrap pt-12 pb-10 md:pt-20 md:pb-14">
      <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,.6fr)] md:gap-16">
        <div className="min-w-0">
          <p className="kicker">
            Estudio de diseño y desarrollo web · {site.city}, {site.region}
          </p>
          <h1 id="hero-title" className="text-display mt-5 font-extrabold">
            Webs y sistemas que hacen <span className="text-muted">trabajar a tu negocio.</span>
          </h1>
          <p className="text-muted mt-6 max-w-[54ch] md:mt-8 md:text-lg">
            Diseñamos páginas web, turnos online y paneles a medida para negocios que quieren vender más y
            perder menos tiempo. Desde Luján, para todo el país.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:mt-10">
            <Button asChild>
              <Link href="/contacto">
                Pedí tu propuesta <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/proyectos">Ver proyectos</Link>
            </Button>
          </div>
          <p className="text-muted mt-4 text-sm">Te respondemos en {site.responseTime}.</p>
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
