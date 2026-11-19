'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor de marca: un punto amarillo y un aro que lo sigue con un poco de inercia.
 * - Sobre links y botones el aro crece.
 * - Sobre un elemento con data-cursor="Texto" se convierte en una burbuja con ese texto (ej. "Ver caso").
 * El cursor del sistema sigue visible (accesibilidad). Solo con mouse y sin "reducir movimiento".
 */
export function CustomCursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const r = ring.current;
    const d = dot.current;
    const l = label.current;
    if (!r || !d || !l) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let shown = false;

    const loop = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      d.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = Math.abs(x - rx) + Math.abs(y - ry) > 0.1 ? requestAnimationFrame(loop) : 0;
    };

    // Qué hay debajo del cursor: se recalcula también al scrollear con la rueda (sin mover el mouse)
    const update = (t: Element | null) => {
      const named = t?.closest<HTMLElement>('[data-cursor]');
      const interactive = t?.closest(
        'a, button, summary, [role="button"], input, select, textarea, [data-drag]',
      );
      const text = named?.dataset.cursor ?? '';
      r.dataset.state = text ? 'label' : interactive ? 'hover' : '';
      if (l.textContent !== text) l.textContent = text;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x = e.clientX;
      y = e.clientY;
      if (!shown) {
        shown = true;
        rx = x;
        ry = y;
        document.documentElement.classList.add('has-cursor');
      }
      update(e.target instanceof Element ? e.target : null);
      if (!raf) raf = requestAnimationFrame(loop);
    };
    let scrollQueued = false;
    const onScroll = () => {
      if (!shown || scrollQueued) return;
      scrollQueued = true;
      requestAnimationFrame(() => {
        scrollQueued = false;
        update(document.elementFromPoint(x, y));
      });
    };
    const onDown = () => r.setAttribute('data-down', '');
    const onUp = () => r.removeAttribute('data-down');
    const onLeave = () => {
      shown = false;
      document.documentElement.classList.remove('has-cursor');
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerup', onUp);
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('has-cursor');
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ring} className="cursor-ring">
        <span ref={label} className="cursor-label" />
      </div>
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
