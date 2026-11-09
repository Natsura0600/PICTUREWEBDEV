'use client';

import dynamic from 'next/dynamic';
import { HeroStarStatic } from './HeroStarStatic';

/**
 * La estrella interactiva carga después del contenido principal, así Framer Motion no
 * compite con el título por la red ni por el procesador. Mientras tanto se ve la versión
 * estática, idéntica y en el mismo lugar (sin saltos de diseño).
 */
export const HeroStarLazy = dynamic(() => import('./HeroStar').then((m) => m.HeroStar), {
  ssr: false,
  loading: () => <HeroStarStatic />,
});
