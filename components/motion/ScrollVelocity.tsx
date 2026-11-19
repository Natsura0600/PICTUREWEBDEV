'use client';

import { useEffect } from 'react';

/**
 * La cinta acelera según la velocidad del scroll y cambia de sentido cuando subís.
 * Ajusta el playbackRate de las animaciones CSS de .marquee-track (Web Animations API).
 */
export function ScrollVelocity() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const tracks = Array.from(document.querySelectorAll<HTMLElement>('.marquee-track'));
    const anims = tracks.flatMap((t) => t.getAnimations());
    if (!anims.length) return;
    // Margen para que, yendo en reversa, la animación nunca llegue a su inicio (ahí se detendría).
    // Se adelanta un múltiplo exacto de su duración, así la cinta no salta de lugar.
    for (const a of anims) {
      const d = Number(a.effect?.getComputedTiming().duration) || 0;
      if (d > 0 && a.currentTime !== null) a.currentTime = Number(a.currentTime) + d * 10000;
    }

    let lastY = window.scrollY;
    let lastT = performance.now();
    let boost = 0;
    let dir = 1;
    let raf = 0;

    const tick = () => {
      boost *= 0.92;
      const rate = dir * (1 + boost);
      for (const a of anims) a.playbackRate = rate;
      raf = boost > 0.02 ? requestAnimationFrame(tick) : 0;
      if (!raf) for (const a of anims) a.playbackRate = dir;
    };

    const onScroll = () => {
      const now = performance.now();
      const dy = window.scrollY - lastY;
      const dt = Math.max(16, now - lastT);
      lastY = window.scrollY;
      lastT = now;
      if (dy !== 0) dir = dy > 0 ? 1 : -1;
      boost = Math.min(8, boost + (Math.abs(dy) / dt) * 1.6);
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);
  return null;
}
