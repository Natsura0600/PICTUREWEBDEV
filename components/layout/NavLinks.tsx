'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { nav } from '@/lib/site';
import { cn } from '@/lib/utils';

type Props = {
  className?: string;
  onNavigate?: () => void;
  /** Píldora de fondo que se desliza hasta la opción bajo el mouse (y vuelve a la página actual). */
  indicator?: boolean;
};

/** Links del menú con estado activo (aria-current) según la ruta. */
export function NavLinks({ className, onNavigate, indicator = false }: Props) {
  const pathname = usePathname();
  const list = useRef<HTMLUListElement>(null);
  const pill = useRef<HTMLLIElement>(null);

  const moveTo = useCallback((el: Element | null | undefined) => {
    const p = pill.current;
    const ul = list.current;
    if (!p || !ul) return;
    if (!el) {
      p.style.opacity = '0';
      return;
    }
    const a = el.getBoundingClientRect();
    const b = ul.getBoundingClientRect();
    p.style.opacity = '1';
    p.style.transform = `translateX(${a.left - b.left}px)`;
    p.style.width = `${a.width}px`;
  }, []);

  const toActive = useCallback(() => {
    moveTo(list.current?.querySelector('[aria-current="page"]'));
  }, [moveTo]);

  // Al cambiar de página (y al cargar), la píldora va a la sección actual
  useEffect(() => {
    if (!indicator) return;
    const p = pill.current;
    // La primera vez se ubica sin animar
    if (p) p.style.transition = 'none';
    toActive();
    const id = requestAnimationFrame(() => {
      if (p) p.style.transition = '';
    });
    window.addEventListener('resize', toActive);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener('resize', toActive);
    };
  }, [indicator, pathname, toActive]);

  return (
    <ul
      ref={list}
      className={cn(indicator && 'relative isolate', className)}
      onPointerLeave={indicator ? toActive : undefined}
    >
      {indicator ? (
        <li
          ref={pill}
          aria-hidden="true"
          className="nav-pill bg-surface border-line absolute inset-y-0 left-0 rounded-full border"
        />
      ) : null}
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href} className={indicator ? 'relative' : undefined}>
            <Link
              href={item.href}
              onClick={onNavigate}
              onPointerEnter={indicator ? (e) => moveTo(e.currentTarget) : undefined}
              onFocus={indicator ? (e) => moveTo(e.currentTarget) : undefined}
              onBlur={indicator ? toActive : undefined}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'nav-link hover:text-fg transition-colors',
                indicator && 'block rounded-full px-4 py-2',
                active ? 'text-fg' : 'text-muted',
              )}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
