'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type SectionLink = { id: string; label: string };

/**
 * Índice lateral del inicio (pantallas grandes): un punto por sección.
 * El de la sección actual se estira en amarillo; al pasar el mouse aparece el nombre;
 * al hacer clic te lleva con desplazamiento suave. Se esconde mientras estás en la portada.
 * `id` es el id del título de la sección; se observa la <section> que lo contiene.
 */
export function SectionIndex({ items }: { items: readonly SectionLink[] }) {
  const [active, setActive] = useState(items[0]?.id ?? '');

  useEffect(() => {
    const map = new Map<Element, string>();
    for (const it of items) {
      const sec = document.getElementById(it.id)?.closest('section');
      if (sec) map.set(sec, it.id);
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = map.get(e.target);
          if (e.isIntersecting && id) setActive(id);
        }
      },
      // La sección "activa" es la que cruza la franja del medio de la pantalla
      { rootMargin: '-45% 0px -50% 0px' },
    );
    map.forEach((_, sec) => io.observe(sec));
    return () => io.disconnect();
  }, [items]);

  const inHero = active === items[0]?.id;

  return (
    <nav
      aria-label="Secciones de esta página"
      className={cn(
        'section-index fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 xl:block',
        inHero && 'is-hidden',
      )}
    >
      <ul className="flex flex-col items-end gap-1">
        {items.map((it) => {
          const on = it.id === active;
          return (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                aria-current={on ? 'location' : undefined}
                className="group flex items-center gap-3 py-1.5 pl-3"
              >
                <span
                  className={cn(
                    'section-index-label bg-surface border-line rounded-full border px-2.5 py-1 text-xs font-bold whitespace-nowrap',
                    on ? 'text-fg' : 'text-muted',
                  )}
                >
                  {it.label}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'ease-out-soft block h-1.5 rounded-full transition-all duration-500',
                    on ? 'bg-accent w-6' : 'bg-muted/50 group-hover:bg-fg w-1.5',
                  )}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
