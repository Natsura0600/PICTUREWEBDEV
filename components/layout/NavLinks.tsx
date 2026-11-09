'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { nav } from '@/lib/site';
import { cn } from '@/lib/utils';

/** Links del header con estado activo (aria-current) según la ruta. */
export function NavLinks({ className, onNavigate }: { className?: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className={className}>
      {nav.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn('hover:text-fg transition-colors', active ? 'text-fg' : 'text-muted')}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
