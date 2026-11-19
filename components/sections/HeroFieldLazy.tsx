'use client';

import dynamic from 'next/dynamic';

/** El canvas interactivo carga después del contenido principal: no compite con el título (LCP). */
export const HeroFieldLazy = dynamic(() => import('./HeroField').then((m) => m.HeroField), {
  ssr: false,
});
