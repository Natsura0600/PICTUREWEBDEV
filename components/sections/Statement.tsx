import { ScrollText } from '@/components/motion/ScrollText';

/** Declaración del estudio: las palabras se encienden a medida que bajás. */
export function Statement() {
  return (
    <section aria-label="Nuestra forma de trabajar" className="border-line border-t py-24 md:py-40">
      <div className="wrap">
        <div className="text-[clamp(1.9rem,5vw,4.4rem)] leading-[1.05] font-extrabold tracking-[-0.045em]">
          <ScrollText
            parts={[
              'No hacemos webs para que estén.',
              { hl: 'Las hacemos para que tu negocio trabaje' },
              'mientras vos te ocupás de lo importante.',
            ]}
          />
        </div>
      </div>
    </section>
  );
}
