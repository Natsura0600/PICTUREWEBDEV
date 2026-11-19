import { ArrowUp, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Tagline, Wordmark } from '@/components/brand/Wordmark';
import { SplitLetters } from '@/components/motion/SplitLetters';
import { nav, site, whatsappUrl } from '@/lib/site';

export function Footer() {
  const year = new Date().getFullYear();
  const linkCls = 'text-muted hover:text-fg transition-colors';
  return (
    <footer className="border-line overflow-hidden border-t">
      <div className="wrap pt-14 md:pt-20">
        <p
          aria-hidden="true"
          className="footer-giant text-[clamp(2.6rem,10.4vw,9.5rem)] leading-[0.9] font-extrabold tracking-[-0.06em] whitespace-nowrap"
        >
          <SplitLetters text="Picture Web Dev" />
          <span className="text-accent-ink">.</span>
        </p>
      </div>

      <div className="wrap mt-12 md:mt-16">
        <div className="border-line grid gap-10 border-t pt-10 sm:grid-cols-2 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Wordmark />
            <p className="text-muted mt-4 max-w-[34ch] text-sm">
              Páginas web, sistemas de turnos y paneles a medida para negocios. Desde {site.city} para todo el
              país.
            </p>
            <Tagline className="mt-6" />
          </div>

          <nav aria-label="Pie de página">
            <p className="kicker">Sitio</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {nav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className={linkCls}>
                    {i.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacidad" className={linkCls}>
                  Privacidad
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <p className="kicker">Hablemos</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <a
                  href={whatsappUrl('Hola, quiero una página web para mi negocio')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-fg inline-flex items-center gap-1.5 font-bold"
                >
                  WhatsApp {site.whatsapp.display}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </li>
              <li>
                <a
                  href={site.formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group text-fg inline-flex items-center gap-1.5 font-bold"
                >
                  Completar el formulario
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </li>
              <li className="text-muted">Respondemos en {site.responseTime}.</li>
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkCls}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="wrap text-muted flex flex-wrap items-center justify-between gap-4 pt-12 pb-[calc(6rem+env(safe-area-inset-bottom))] text-xs">
        <p>
          © {year} {site.name} · {site.city}, {site.region}
        </p>
        <a href="#contenido" className="hover:text-fg group inline-flex items-center gap-1.5 font-bold">
          Volver arriba
          <ArrowUp
            aria-hidden="true"
            className="size-3.5 transition-transform group-hover:-translate-y-0.5"
          />
        </a>
      </div>
    </footer>
  );
}
