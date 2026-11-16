import Link from 'next/link';
import { Star } from '@/components/brand/Star';
import { Wordmark } from '@/components/brand/Wordmark';
import { Button } from '@/components/ui/button';
import { whatsappUrl } from '@/lib/site';
import { MobileNav } from './MobileNav';
import { NavLinks } from './NavLinks';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  return (
    <header className="border-line bg-bg/90 supports-[backdrop-filter]:bg-bg/75 sticky top-0 z-40 border-b backdrop-blur-md">
      <div className="wrap flex h-16 items-center justify-between gap-4 md:h-[4.5rem]">
        <Link href="/" className="flex items-center gap-3" aria-label="Picture Web Dev, inicio">
          <Star className="size-8" />
          <Wordmark />
        </Link>
        <nav aria-label="Principal" className="hidden md:block">
          <NavLinks className="flex items-center gap-8 text-sm font-semibold" />
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden md:inline-flex" />
          <Button asChild size="sm" className="hidden md:inline-flex">
            <a href={whatsappUrl('Hola, quiero una página web para mi negocio')} target="_blank" rel="noopener noreferrer">
              Escribinos por WhatsApp
            </a>
          </Button>
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
