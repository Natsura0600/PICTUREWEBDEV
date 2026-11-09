import { Reveal } from '@/components/motion/Reveal';
import { steps } from '@/lib/site';

export function Process({ kicker = '04 · Cómo trabajamos' }: { kicker?: string }) {
  return (
    <section aria-labelledby="proceso-title" className="border-line border-t py-20 md:py-28">
      <div className="wrap grid gap-10 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] md:gap-16">
        <Reveal>
          <p className="kicker">{kicker}</p>
          <h2 id="proceso-title" className="text-h2 mt-4 font-extrabold">
            Menos vueltas. <span className="hl">Mejores herramientas.</span>
          </h2>
        </Reveal>
        <ol className="border-line border-t">
          {steps.map((s, i) => (
            <Reveal
              as="li"
              key={s.title}
              className="border-line grid grid-cols-[2.75rem_minmax(0,1fr)] gap-3 border-b py-6"
            >
              <span className="label-marca light-up text-muted pt-1 !text-[1rem]">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="text-lg font-bold tracking-[-0.02em] md:text-xl">{s.title}</h3>
                <p className="text-muted mt-1.5 max-w-[60ch] text-[0.9375rem]">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
