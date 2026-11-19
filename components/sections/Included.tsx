import {
  Gauge,
  Headset,
  LayoutDashboard,
  MessageCircle,
  Palette,
  Search,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';
import { Reveal } from '@/components/motion/Reveal';
import { included } from '@/lib/site';
import { SectionHeading } from './SectionHeading';

const ICONS: Record<(typeof included)[number]['icon'], LucideIcon> = {
  palette: Palette,
  smartphone: Smartphone,
  zap: Gauge,
  search: Search,
  message: MessageCircle,
  dashboard: LayoutDashboard,
  shield: ShieldCheck,
  headset: Headset,
};

/** Lo que trae cada proyecto, sin importar el tamaño. */
export function Included({ kicker = '03 · Incluido' }: { kicker?: string }) {
  return (
    <section aria-labelledby="incluido-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        <SectionHeading
          id="incluido-title"
          kicker={kicker}
          title={
            <>
              Todo lo que tu web necesita, <span className="hl">desde el día uno.</span>
            </>
          }
          lead="Sea una landing o un sistema completo, cada proyecto sale con lo mismo de base. Sin extras escondidos."
        />
        <ul className="rounded-marca border-line bg-line grid gap-px overflow-hidden border sm:grid-cols-2 lg:grid-cols-4">
          {included.map((it, i) => {
            const Icon = ICONS[it.icon];
            return (
              <Reveal
                as="li"
                key={it.title}
                delay={(i % 4) * 0.05}
                data-spotlight
                className="spot-card group bg-bg flex min-w-0 flex-col p-6 md:p-7"
              >
                <span className="border-line text-accent-ink group-hover:bg-accent group-hover:text-on-accent group-hover:border-accent grid size-11 place-items-center rounded-xl border transition-colors duration-300">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-6 text-lg font-bold tracking-[-0.02em]">{it.title}</h3>
                <p className="text-muted mt-2 text-[0.9375rem]">{it.text}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
