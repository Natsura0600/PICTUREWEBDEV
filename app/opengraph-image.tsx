import { brandOg, ogSize } from '@/lib/og';

export const alt = 'Picture Web Dev: páginas web y sistemas para negocios';
export const size = ogSize;
export const contentType = 'image/png';

export default function Image() {
  return brandOg({
    kicker: 'Luján, Buenos Aires',
    title: 'Webs y sistemas que hacen trabajar a tu negocio.',
    sub: 'Páginas web, turnos online y paneles a medida.',
  });
}
