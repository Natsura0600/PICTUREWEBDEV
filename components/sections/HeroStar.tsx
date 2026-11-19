'use client';

import {
  LazyMotion,
  MotionConfig,
  domMax,
  m,
  useAnimate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef } from 'react';
import { Frame, Star } from '@/components/brand/Star';

/**
 * El elemento memorable del hero: la estrella del logo dentro de su marco.
 * - Gira apenas siguiendo el cursor y se achica al hacer scroll.
 * - Se puede agarrar y tirar: vuelve a su lugar con un resorte.
 * - Al hacer clic (o tocarla) da una vuelta completa y suelta una onda.
 * Con "reducir movimiento" queda quieta.
 *
 * Framer Motion vive solo acá y este componente se carga después del contenido principal (ver HeroStarLazy).
 */
function Star3D() {
  const reduce = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotate = useSpring(useTransform(pointerX, [-1, 1], [-8, 8]), { stiffness: 60, damping: 18 });
  const tilt = useSpring(useTransform(pointerY, [-1, 1], [4, -4]), { stiffness: 60, damping: 18 });
  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 600], [1, 0.82]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.35]);
  const constraints = useRef<HTMLDivElement>(null);
  const [scope, animate] = useAnimate();
  const spins = useRef(0);
  const dragged = useRef(false);

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, pointerX, pointerY]);

  const spin = () => {
    if (reduce || dragged.current) return;
    spins.current += 1;
    animate('[data-spin]', { rotate: spins.current * 360 }, { type: 'spring', stiffness: 70, damping: 12 });
    animate(
      '[data-wave]',
      { scale: [0.4, 1.5], opacity: [0.7, 0] },
      { duration: 0.9, ease: [0.2, 0.7, 0.2, 1] },
    );
  };

  return (
    <m.div
      ref={constraints}
      aria-hidden="true"
      className="relative aspect-square w-full"
      style={reduce ? undefined : { scale, opacity }}
    >
      <Frame className="text-accent absolute inset-0 size-full opacity-70" strokeWidth={2} />
      <div ref={scope} className="absolute inset-[13%]">
        <span
          data-wave
          className="border-accent pointer-events-none absolute inset-0 rounded-full border-2 opacity-0"
        />
        <m.div
          data-drag
          className="size-full cursor-grab touch-none active:cursor-grabbing"
          drag={!reduce}
          dragConstraints={constraints}
          dragElastic={0.35}
          dragSnapToOrigin
          dragTransition={{ bounceStiffness: 260, bounceDamping: 14 }}
          whileHover={reduce ? undefined : { scale: 1.06 }}
          whileTap={reduce ? undefined : { scale: 0.92 }}
          whileDrag={{ scale: 1.1 }}
          onDragStart={() => {
            dragged.current = true;
          }}
          onPointerDown={() => {
            dragged.current = false;
          }}
          onTap={spin}
          style={reduce ? undefined : { rotate, rotateX: tilt }}
        >
          <m.div data-spin className="size-full">
            <Star className="spin-slow pointer-events-none size-full" />
          </m.div>
        </m.div>
      </div>
    </m.div>
  );
}

export function HeroStar() {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">
        <Star3D />
      </MotionConfig>
    </LazyMotion>
  );
}
