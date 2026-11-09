import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { site, whatsappUrl } from '@/lib/site';

/** Banda invertida de cierre: una sola acción principal. */
export function ContactCTA() {
  return (
    <section aria-labelledby="cta-title" className="bg-fg text-bg">
      <div className="wrap grid gap-8 py-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] md:items-end md:py-28">
        <div>
          <p className="kicker !text-current opacity-60">Hablemos</p>
          <h2 id="cta-title" className="text-h2 mt-4 font-extrabold">
            Contanos qué querés resolver. Te respondemos en {site.responseTime}.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="border-bg bg-bg text-fg hover:opacity-90">
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
