import type { ReactNode } from 'react';
import { Reveal } from '@/components/motion/Reveal';
import { cn } from '@/lib/utils';

type Props = {
  kicker: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  as?: 'h1' | 'h2';
  className?: string;
};

/** Encabezado de sección: etiqueta a la izquierda, título y bajada a la derecha. */
export function SectionHeading({ kicker, title, lead, id, as = 'h2', className }: Props) {
  const H = as;
  // El título principal de la página no se anima: tiene que pintarse de entrada (mejor LCP)
  const Wrap = as === 'h1' ? 'div' : Reveal;
  return (
    <Wrap
      className={cn(
        'mb-10 grid gap-4 md:mb-14 md:grid-cols-[minmax(0,.7fr)_minmax(0,1.3fr)] md:gap-16',
        className,
      )}
    >
      <p className="kicker pt-2">{kicker}</p>
      <div className="min-w-0">
        <H id={id} className={cn('font-extrabold', as === 'h1' ? 'text-display' : 'text-h2')}>
          {title}
        </H>
        {lead ? <p className="text-muted mt-5 max-w-[58ch] md:text-lg">{lead}</p> : null}
      </div>
    </Wrap>
  );
}
