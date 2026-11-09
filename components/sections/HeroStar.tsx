'use client';

import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  m,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect } from 'react';
import { Frame, Star } from '@/components/brand/Star';

/**
 * El elemento memorable del hero: la estrella del logo dentro de su marco.
 * Gira apenas siguiendo el cursor y se achica al hacer scroll.
 * En celular (sin mouse) y con "reducir movimiento" queda quieta.
 *
 * Framer Motion vive solo acá (LazyMotion + `m`, ~5 kB de features) y este componente
 * se carga después del contenido principal (ver HeroStarLazy).
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

  useEffect(() => {
    if (reduce || !window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      pointerX.set((e.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduce, pointerX, pointerY]);

  return (
    <m.div
      aria-hidden="true"
      className="relative aspect-square w-full"
      style={reduce ? undefined : { scale, opacity }}
    >
      <Frame className="text-line absolute inset-0 size-full" strokeWidth={2} />
      <m.div className="absolute inset-[13%]" style={reduce ? undefined : { rotate, rotateX: tilt }}>
        <Star className="size-full" />
      </m.div>
    </m.div>
  );
}

export function HeroStar() {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">
        <Star3D />
      </MotionConfig>
    </LazyMotion>
  );
}
