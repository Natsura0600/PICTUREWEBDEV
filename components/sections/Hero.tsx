import { FileText, MessageCircle } from 'lucide-react';
import type { CSSProperties } from 'react';
import { CountUp } from '@/components/motion/CountUp';
import { SplitLetters } from '@/components/motion/SplitLetters';
import { Button } from '@/components/ui/button';
import { site, whatsappUrl } from '@/lib/site';
import { HeroFieldLazy } from './HeroFieldLazy';
import { HeroStarLazy } from './HeroStarLazy';

const i = (n: number) => ({ '--i': n }) as CSSProperties;

export function Hero({ projectCount }: { projectCount: number }) {
  const stats = [
    { value: projectCount, suffix: '', label: 'proyectos en producción' },
    { value: 24, prefix: '<', suffix: ' h', label: 'para responderte' },
    { value: 100, suffix: '%', label: 'diseño a medida' },
    { value: 1, suffix: '', label: 'persona de punta a punta' },
  ];
  return (
    <section aria-labelledby="hero-title" className="hero relative isolate overflow-hidden">
      <HeroFieldLazy />
      {/* Halo de acento detrás de la estrella */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-10 right-[8%] -z-10 hidden size-[34rem] rounded-full opacity-[0.12] md:block"
        style={{ background: 'radial-gradient(circle, var(--accent), transparent 65%)' }}
      />
      {/* Desvanece el canvas hacia abajo para que se funda con la cinta */}
      <div
        aria-hidden="true"
        className="from-bg pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t to-transparent"
      />
      <div className="wrap pt-12 pb-10 md:pt-20 md:pb-14">
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,.6fr)] md:gap-16">
          <div className="min-w-0">
            <p className="kicker fade-up" style={i(0)}>
              <span
                className="bg-accent pulse-dot mr-2 inline-block size-2 rounded-full align-middle"
                aria-hidden="true"
              />
              Estudio de diseño y desarrollo web · {site.city}, {site.region}
            </p>
            <h1 id="hero-title" className="text-display mt-5 font-extrabold">
              <span className="line-mask">
                <span style={i(0)}>
                  <SplitLetters text="Webs y sistemas" />
                </span>
              </span>
              <span className="line-mask">
                <span style={i(1)}>
                  <SplitLetters text="que hacen" />
                </span>
              </span>
              <span className="line-mask">
                <span style={i(2)}>
                  <span className="hl">
                    <SplitLetters text="trabajar a tu" />
                  </span>
                </span>
              </span>
              <span className="line-mask">
                <span style={i(3)}>
                  <span className="hl">
                    <SplitLetters text="negocio." />
                  </span>
                </span>
              </span>
            </h1>
            <p className="text-muted fade-up mt-6 max-w-[54ch] md:mt-8 md:text-lg" style={i(2)}>
              Diseñamos páginas web, turnos online y paneles a medida para negocios que quieren vender más y
              perder menos tiempo. Desde Luján, para todo el país.
            </p>
            <div className="fade-up mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap md:mt-10" style={i(3)}>
              <Button asChild data-magnetic="0.25" className="magnetic">
                <a
                  href={whatsappUrl('Hola, quiero una página web para mi negocio')}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle aria-hidden="true" /> Escribinos por WhatsApp
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                data-magnetic="0.25"
                className="magnetic bg-bg/60 backdrop-blur-sm"
              >
                <a href={site.formUrl} target="_blank" rel="noopener noreferrer">
                  <FileText aria-hidden="true" /> Completá el formulario
                </a>
              </Button>
            </div>
            <p className="text-muted fade-up mt-4 text-sm" style={i(4)}>
              Te respondemos en {site.responseTime}.
              <span className="hidden md:inline"> Probá mover el mouse o arrastrar la estrella ✦</span>
            </p>
          </div>
          <div className="order-first w-28 sm:w-36 md:order-none md:w-full md:max-w-[26rem] md:justify-self-end">
            <HeroStarLazy />
          </div>
        </div>
        <dl
          className="border-line fade-up mt-14 grid grid-cols-2 gap-x-6 gap-y-6 border-t pt-6 md:mt-20 md:grid-cols-4"
          style={i(5)}
        >
          {stats.map((s) => (
            <div key={s.label} className="flex min-w-0 flex-col-reverse">
              <dt className="text-muted mt-2 text-sm">{s.label}</dt>
              <dd className="text-[clamp(2rem,4vw,3rem)] leading-none font-extrabold tracking-[-0.04em]">
                {s.prefix}
                <CountUp value={s.value} />
                <span className="text-accent-ink">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
