import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = { children: ReactNode; className?: string; delay?: number; as?: 'div' | 'li' | 'article' };

/**
 * Aparición suave al entrar en pantalla, con animación CSS ligada al scroll (animation-timeline: view()).
 * - Cero JavaScript: no suma peso ni retrasa la interacción.
 * - Nunca deja contenido oculto: si el navegador no la soporta, o si alguien salta con el scroll,
 *   el contenido ya está visible. Con "reducir movimiento" no anima.
 */
export function Reveal({ children, className, delay = 0, as: Comp = 'div' }: Props) {
  const style = delay ? ({ '--reveal-delay': `${delay * 40}%` } as CSSProperties) : undefined;
  return (
    <Comp className={cn('reveal', className)} style={style}>
      {children}
    </Comp>
  );
}
