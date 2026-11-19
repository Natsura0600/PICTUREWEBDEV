'use client';

import { useEffect } from 'react';

/**
 * Foco de luz que sigue al cursor dentro de las tarjetas marcadas con data-spotlight
 * (escribe --mx / --my en la tarjeta). Montado una sola vez en el layout, con delegación de eventos.
 * Solo con mouse o trackpad y sin "reducir movimiento". Sin re-renders de React.
 */
export function PointerFx() {
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.documentElement.classList.add('fx-pointer');
    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      const e = last;
      const target = e?.target instanceof Element ? e.target : null;
      const spot = target?.closest<HTMLElement>('[data-spotlight]');
      if (!e || !spot) return;
      const r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
      spot.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.classList.remove('fx-pointer');
    };
  }, []);

  return null;
}
