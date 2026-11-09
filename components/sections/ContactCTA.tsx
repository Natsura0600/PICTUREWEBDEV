import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Star } from '@/components/brand/Star';
import { Button } from '@/components/ui/button';
import { site, whatsappUrl } from '@/lib/site';

/** Banda invertida de cierre: una sola acción principal. */
export function ContactCTA() {
  return (
    <section aria-labelledby="cta-title" className="bg-accent text-on-accent relative overflow-hidden">
      <Star className="text-on-accent spin-slow pointer-events-none absolute -right-16 -bottom-24 size-[22rem] opacity-[0.08] md:size-[30rem]" />
      <div className="wrap relative grid gap-8 py-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] md:items-end md:py-28">
        <div>
          <p className="kicker !text-current opacity-75">Hablemos</p>
          <h2 id="cta-title" className="text-h2 mt-4 font-extrabold">
            Contanos qué querés resolver. Te respondemos en {site.responseTime}.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="border-negro bg-negro text-hueso hover:opacity-90">
            <Link href="/contacto">
              Pedí tu propuesta <ArrowUpRight aria-hidden="true" />
            </Link>
          </Button>
          <a
            href={whatsappUrl('Hola, quiero una página web para mi negocio')}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center text-sm font-bold underline underline-offset-4 opacity-80 hover:opacity-100"
          >
            O escribinos por WhatsApp: {site.whatsapp.display}
          </a>
        </div>
      </div>
    </section>
  );
}
