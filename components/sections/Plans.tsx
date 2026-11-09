import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/button';
import { plans, plansNote } from '@/lib/site';
import { cn } from '@/lib/utils';
import { SectionHeading } from './SectionHeading';

/** "desde USD 300" → "desde" chico arriba y el número en grande, sin cortes de línea feos. */
function Price({ value, suffix }: { value: string; suffix?: string }) {
  const from = value.startsWith('desde ');
  const amount = from ? value.slice(6) : value;
  return (
    <>
      <span className={cn('block text-xs font-bold tracking-normal opacity-75', !from && 'invisible')}>
        desde
      </span>
      <span className="whitespace-nowrap">
        {amount}
        {suffix ? <span className="text-sm font-bold opacity-75">{suffix}</span> : null}
      </span>
    </>
  );
}

export function Plans({ kicker = '03 · Planes' }: { kicker?: string }) {
  return (
    <section id="planes" aria-labelledby="planes-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap">
        <SectionHeading
          id="planes-title"
          kicker={kicker}
          title={
            <>
              Precios claros, <span className="hl">sin sorpresas.</span>
            </>
          }
          lead="Un pago inicial por el diseño y desarrollo, y un abono mensual que mantiene tu web online, segura y al día."
        />
        <ul className="grid gap-4 lg:grid-cols-3">
          {plans.map((p, i) => (
            <Reveal
              as="li"
              key={p.id}
              delay={i * 0.06}
              className={cn(
                'rounded-marca flex min-w-0 flex-col border p-6 md:p-8',
                p.featured
                  ? 'border-accent bg-accent text-on-accent shadow-[0_24px_60px_-30px_var(--accent)] lg:-translate-y-3'
                  : 'border-line bg-surface hover:border-accent-ink/60 transition-[border-color,transform] duration-300 hover:-translate-y-1',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className={cn('label-marca', p.featured ? 'opacity-80' : 'text-muted')}>
                    Plan {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">{p.name}</h3>
                  <p className={cn('mt-1 text-sm', p.featured ? 'opacity-75' : 'text-muted')}>{p.sub}</p>
                </div>
              </div>
              <dl
                className={cn(
                  'my-6 grid grid-cols-2 gap-3 border-y py-5',
                  p.featured ? 'border-on-accent/20' : 'border-line',
                )}
              >
                <div>
                  <dt className={cn('kicker !text-[0.6875rem]', p.featured && '!text-current opacity-80')}>
                    Inicial
                  </dt>
                  <dd className="mt-1 text-xl font-extrabold tracking-[-0.03em] tabular-nums md:text-2xl">
                    <Price value={p.setup} />
                  </dd>
                </div>
                <div>
                  <dt className={cn('kicker !text-[0.6875rem]', p.featured && '!text-current opacity-80')}>
                    Abono
                  </dt>
                  <dd className="mt-1 text-xl font-extrabold tracking-[-0.03em] tabular-nums md:text-2xl">
                    <Price value={p.monthly} suffix="/mes" />
                  </dd>
                </div>
              </dl>
              <ul className="mb-8 grid gap-2.5 text-[0.9375rem]">
                {p.items.map((it) => (
                  <li
                    key={it}
                    className="relative pl-5 before:absolute before:top-[.72em] before:left-0 before:h-0.5 before:w-2.5 before:bg-current"
                  >
                    {it}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={p.featured ? 'primary' : 'outline'}
                className={cn(
                  'mt-auto w-full',
                  p.featured && 'border-negro bg-negro text-hueso hover:opacity-90',
                )}
              >
                <Link href={{ pathname: '/contacto', query: { plan: p.id } }}>Quiero el plan {p.name}</Link>
              </Button>
            </Reveal>
          ))}
        </ul>
        <p className="text-muted mt-6 max-w-[80ch] text-sm">{plansNote}</p>
      </div>
    </section>
  );
}
