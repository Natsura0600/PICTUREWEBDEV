'use client';

import { ArrowUp } from 'lucide-react';
import { useEffect, useRef } from 'react';

/**
 * Estado de scroll compartido por la interfaz, sin re-renders de React:
 * - <html data-scrolled> cuando bajaste un poco: el encabezado se compacta (CSS).
 * - Botón "volver arriba" que aparece después de la primera pantalla, con un anillo
 *   que muestra cuánto de la página llevás recorrido (--p de 0 a 1).
 */
export function ScrollUi() {
  const btn = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      root.toggleAttribute('data-scrolled', y > 24);
      const el = btn.current;
      if (el) {
        el.toggleAttribute('data-show', y > window.innerHeight * 0.9);
        el.style.setProperty('--p', String(max > 0 ? Math.min(1, y / max) : 0));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <a
      ref={btn}
      href="#contenido"
      aria-label="Volver arriba"
      className="to-top bg-bg/85 text-fg border-line fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[calc(5rem+env(safe-area-inset-bottom))] z-30 grid size-12 place-items-center rounded-full border backdrop-blur-md"
    >
      <svg viewBox="0 0 48 48" aria-hidden="true" className="absolute inset-0 size-full -rotate-90">
        <circle
          cx="24"
          cy="24"
          r="22"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          pathLength="1"
          className="to-top-ring"
        />
      </svg>
      <ArrowUp className="size-4" aria-hidden="true" />
    </a>
  );
}
