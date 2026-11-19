'use client';

import { useEffect, useRef } from 'react';

type Dot = { x: number; y: number; ox: number; oy: number; vx: number; vy: number };

const SPACING = 34;
const RADIUS = 120;

/**
 * Fondo interactivo del hero: una grilla de puntos quieta que se aparta suavemente del cursor (o del dedo).
 * Los puntos cerca del puntero se encienden en amarillo y se unen con líneas finas.
 *
 * - Canvas 2D sin librerías. Solo anima mientras el puntero está encima y hasta que los puntos se acomodan;
 *   el resto del tiempo no consume nada. Se pausa fuera de pantalla y con la pestaña oculta.
 * - Con "reducir movimiento" dibuja la grilla una vez y queda quieta.
 * - Decorativo: aria-hidden y pointer-events none (escucha el puntero en la sección padre).
 */
export function HeroField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !host || !ctx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let visible = true;
    const pointer = { x: -9999, y: -9999, active: false, power: 0 };
    let fg = '231,227,221';
    let accent = '255,194,26';

    const readColors = () => {
      const s = getComputedStyle(document.documentElement);
      const toRgb = (hex: string) => {
        const m = hex.trim().replace('#', '');
        if (m.length !== 6) return null;
        return `${parseInt(m.slice(0, 2), 16)},${parseInt(m.slice(2, 4), 16)},${parseInt(m.slice(4, 6), 16)}`;
      };
      fg = toRgb(s.getPropertyValue('--fg')) ?? fg;
      accent = toRgb(s.getPropertyValue('--accent-ink')) ?? accent;
    };

    const build = () => {
      const r = host.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      const step = w < 640 ? SPACING * 0.85 : SPACING;
      for (let y = step / 2; y < h; y += step) {
        for (let x = step / 2; x < w; x += step) {
          dots.push({ x, y, ox: x, oy: y, vx: 0, vy: 0 });
        }
      }
    };

    /** Dibuja un cuadro y devuelve si todavía hay movimiento. */
    const draw = (): boolean => {
      ctx.clearRect(0, 0, w, h);
      let moving = false;
      pointer.power += ((pointer.active ? 1 : 0) - pointer.power) * 0.08;
      const near: Dot[] = [];

      for (const d of dots) {
        const bx = d.ox;
        const by = d.oy;
        const dx = d.x - pointer.x;
        const dy = d.y - pointer.y;
        const dist = Math.hypot(dx, dy);
        if (dist < RADIUS && pointer.power > 0.01) {
          const f = (1 - dist / RADIUS) ** 2 * 3.5 * pointer.power;
          d.vx += (dx / (dist || 1)) * f;
          d.vy += (dy / (dist || 1)) * f;
        }
        // Resorte de vuelta a su lugar
        d.vx += (bx - d.x) * 0.06;
        d.vy += (by - d.y) * 0.06;
        d.vx *= 0.82;
        d.vy *= 0.82;
        d.x += d.vx;
        d.y += d.vy;
        if (Math.abs(d.vx) + Math.abs(d.vy) > 0.02) moving = true;

        const glow = dist < RADIUS ? (1 - dist / RADIUS) * pointer.power : 0;
        if (glow > 0.15) near.push(d);
        ctx.beginPath();
        ctx.fillStyle = glow > 0.02 ? `rgba(${accent},${0.25 + glow * 0.75})` : `rgba(${fg},0.13)`;
        ctx.arc(d.x, d.y, 1.1 + glow * 1.9, 0, Math.PI * 2);
        ctx.fill();
      }

      // Constelación: une los puntos encendidos cercanos entre sí
      ctx.lineWidth = 1;
      for (let i = 0; i < near.length; i++) {
        for (let j = i + 1; j < near.length; j++) {
          const a = near[i]!;
          const b = near[j]!;
          const dd = Math.hypot(a.x - b.x, a.y - b.y);
          if (dd < SPACING * 1.6) {
            ctx.strokeStyle = `rgba(${accent},${(1 - dd / (SPACING * 1.6)) * 0.3 * pointer.power})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      return moving || pointer.active || pointer.power > 0.01;
    };

    const loop = () => {
      const keepGoing = draw();
      raf = keepGoing && visible && !document.hidden ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && !reduce && visible && !document.hidden) raf = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
      start();
    };
    const onLeave = () => {
      pointer.active = false;
      start();
    };

    readColors();
    build();
    draw();

    const ro = new ResizeObserver(() => {
      build();
      draw();
    });
    ro.observe(host);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      start();
    });
    io.observe(host);
    const mo = new MutationObserver(() => {
      readColors();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    const onVis = () => start();
    document.addEventListener('visibilitychange', onVis);
    host.addEventListener('pointermove', onMove, { passive: true });
    host.addEventListener('pointerdown', onMove, { passive: true });
    host.addEventListener('pointerleave', onLeave);
    host.addEventListener('pointercancel', onLeave);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      host.removeEventListener('pointermove', onMove);
      host.removeEventListener('pointerdown', onMove);
      host.removeEventListener('pointerleave', onLeave);
      host.removeEventListener('pointercancel', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="hero-field pointer-events-none absolute inset-0 -z-10 size-full"
    />
  );
}
