'use client';

import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';

/** El menú (Radix Dialog) se descarga recién cuando alguien lo va a usar: ~30 kB menos en cada página. */
const loadMenu = () => import('./MobileMenu').then((m) => m.MobileMenu);
const MobileMenu = dynamic(loadMenu, { ssr: false });

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={trigger}
        variant="outline"
        size="icon"
        className="md:hidden"
        aria-label="Abrir menú"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={() => void loadMenu()}
        onTouchStart={() => void loadMenu()}
        onClick={() => setOpen(true)}
      >
        <Menu aria-hidden="true" />
      </Button>
      {open ? (
        <MobileMenu
          onClose={() => {
            setOpen(false);
            // Devolver el foco al botón cuando Radix ya liberó el resto de la página
            requestAnimationFrame(() => trigger.current?.focus());
          }}
        />
      ) : null}
    </>
  );
}
