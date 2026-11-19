'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet';
import { site, whatsappUrl } from '@/lib/site';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

/** Panel lateral del menú en celular. Radix se encarga de atrapar el foco, Escape y aria. */
export function MobileMenu({ onClose }: { onClose: () => void }) {
  return (
    <Sheet open onOpenChange={(v) => !v && onClose()}>
      <SheetContent aria-describedby="menu-desc" onCloseAutoFocus={(e) => e.preventDefault()}>
        <div className="flex items-center justify-between">
          <SheetTitle className="label-marca">Menú</SheetTitle>
          <SheetClose asChild>
            <Button variant="outline" size="icon" aria-label="Cerrar menú">
              <X aria-hidden="true" />
            </Button>
          </SheetClose>
        </div>
        <SheetDescription id="menu-desc" className="sr-only">
          Secciones del sitio de {site.name}
        </SheetDescription>
        <nav aria-label="Principal (celular)" className="mt-10">
          <NavLinks
            onNavigate={onClose}
            className="[&_a]:border-line flex flex-col text-2xl font-extrabold tracking-[-0.03em] [&_a]:block [&_a]:border-b [&_a]:py-4"
          />
        </nav>
        <div className="menu-actions mt-auto flex flex-col gap-3">
          <Button asChild>
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
              WhatsApp {site.whatsapp.display}
            </a>
          </Button>
          <Button asChild variant="outline">
            <a href={site.formUrl} target="_blank" rel="noopener noreferrer">
              Completá el formulario
            </a>
          </Button>
          <ThemeToggle className="self-start" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
