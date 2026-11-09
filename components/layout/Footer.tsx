import Link from 'next/link';
import { Tagline, Wordmark } from '@/components/brand/Wordmark';
import { nav, site, whatsappUrl } from '@/lib/site';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-line border-t">
      <div className="wrap grid gap-10 pt-12 pb-[calc(6rem+env(safe-area-inset-bottom))] md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <Wordmark />
          <p className="text-muted mt-3 text-xs">
            © {year} · {site.city}, {site.region}
          </p>
        </div>
        <nav aria-label="Pie de página">
          <ul className="text-muted flex flex-wrap gap-x-6 gap-y-3 text-sm md:justify-center">
            {nav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="hover:text-fg">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/privacidad" className="hover:text-fg">
                Privacidad
              </Link>
            </li>
            <li>
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                WhatsApp
              </a>
            </li>
            {site.socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <Tagline className="md:text-right" />
      </div>
    </footer>
  );
}
