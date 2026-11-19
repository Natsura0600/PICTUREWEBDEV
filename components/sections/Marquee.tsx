import { Star } from '@/components/brand/Star';

const ITEMS = [
  'Páginas web',
  'Turnos online',
  'Paneles a medida',
  'Pedidos online',
  'Landings',
  'Mantenimiento',
  'Diseño a medida',
  'Hecho en Luján',
];

/** Cinta infinita con los servicios. Decorativa: los lectores de pantalla la saltean. */
export function Marquee() {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {ITEMS.map((t) => (
        <li key={t} className="flex items-center gap-6 pr-6 md:gap-10 md:pr-10">
          <span className="text-[clamp(1.4rem,3.2vw,2.6rem)] font-extrabold tracking-[-0.04em] whitespace-nowrap uppercase">
            {t}
          </span>
          <Star className="size-5 md:size-7" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Servicios" className="marquee py-4 md:py-6">
      <div className="bg-accent text-on-accent relative z-10 -rotate-[1.5deg] overflow-hidden py-4 md:py-5">
        <div className="marquee-track">
          {row(false)}
          {row(true)}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="bg-surface text-fg border-line -mt-3 rotate-[1deg] overflow-hidden border-y py-3 md:-mt-4 md:py-4"
      >
        <div className="marquee-track marquee-track--reverse">
          {row(true)}
          {row(true)}
        </div>
      </div>
    </section>
  );
}
