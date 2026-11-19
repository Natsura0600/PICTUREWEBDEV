'use client';

import { useEffect } from 'react';

/**
 * Motor único de efectos de puntero, montado una sola vez en el layout.
 * Usa delegación de eventos, así los componentes del servidor solo marcan atributos:
 *
 * - data-spotlight: la tarjeta recibe --mx / --my (posición del cursor) para pintar un foco de luz.
 * - data-tilt:      la tarjeta se inclina en 3D hacia el cursor (--rx / --ry) con un reflejo (--gx / --gy).
 * - data-magnetic:  el botón se acerca un poco al cursor (--tx / --ty) y vuelve con resorte al salir.
 *
 * Solo corre con mouse o trackpad (pointer: fine) y sin "reducir movimiento".
 * Todo se escribe en variables CSS dentro de un requestAnimationFrame: sin re-renders de React.
 */
export function PointerFx() {
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!fine.matches || reduce.matches) return;

    document.documentElement.classList.add('fx-pointer');

    let frame = 0;
    let last: PointerEvent | null = null;
    let tiltEl: HTMLElement | null = null;
    let magEl: HTMLElement | null = null;

    const resetTilt = (el: HTMLElement) => {
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
      el.removeAttribute('data-active');
    };
    const resetMag = (el: HTMLElement) => {
      el.style.setProperty('--tx', '0px');
      el.style.setProperty('--ty', '0px');
    };

    const apply = () => {
      frame = 0;
      const e = last;
      if (!e) return;
      const target = e.target instanceof Element ? e.target : null;

      // Foco de luz: todas las tarjetas visibles de un mismo grupo comparten el cursor
      const spot = target?.closest<HTMLElement>('[data-spotlight]');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${e.clientX - r.left}px`);
        spot.style.setProperty('--my', `${e.clientY - r.top}px`);
      }

      const tilt = target?.closest<HTMLElement>('[data-tilt]') ?? null;
      if (tiltEl && tiltEl !== tilt) resetTilt(tiltEl);
      tiltEl = tilt;
      if (tilt) {
        const r = tilt.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        const max = Number(tilt.dataset.tilt) || 6;
        tilt.style.setProperty('--ry', `${(px - 0.5) * max * 2}deg`);
        tilt.style.setProperty('--rx', `${(0.5 - py) * max * 2}deg`);
        tilt.style.setProperty('--gx', `${px * 100}%`);
        tilt.style.setProperty('--gy', `${py * 100}%`);
        tilt.setAttribute('data-active', '');
      }

      const mag = target?.closest<HTMLElement>('[data-magnetic]') ?? null;
      if (magEl && magEl !== mag) resetMag(magEl);
      magEl = mag;
      if (mag) {
        const r = mag.getBoundingClientRect();
        const strength = Number(mag.dataset.magnetic) || 0.3;
        // Con tope: en botones anchos el desplazamiento no pasa de unos pocos píxeles
        const clamp = (v: number, max: number) => Math.max(-max, Math.min(max, v));
        mag.style.setProperty('--tx', `${clamp((e.clientX - (r.left + r.width / 2)) * strength, 10)}px`);
        mag.style.setProperty('--ty', `${clamp((e.clientY - (r.top + r.height / 2)) * strength, 6)}px`);
      }
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      if (tiltEl) resetTilt(tiltEl);
      if (magEl) resetMag(magEl);
      tiltEl = magEl = null;
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('fx-pointer');
    };
  }, []);

  return null;
}
