import { Frame, Star } from '@/components/brand/Star';

/** Versión estática de la estrella del hero: mismo tamaño y posición que la interactiva. */
export function HeroStarStatic() {
  return (
    <div aria-hidden="true" className="relative aspect-square w-full">
      <Frame className="text-line absolute inset-0 size-full" strokeWidth={2} />
      <div className="absolute inset-[13%]">
        <Star className="size-full" />
      </div>
    </div>
  );
}
