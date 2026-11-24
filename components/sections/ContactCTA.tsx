import { FileText, MessageCircle } from 'lucide-react';
import { Star } from '@/components/brand/Star';
import { Button } from '@/components/ui/button';
import { site, whatsappUrl } from '@/lib/site';

/** Banda de cierre en tono pastel: una sola acción principal. */
export function ContactCTA() {
  return (
    <section
      aria-labelledby="cta-title"
      data-tone="butter"
      className="bg-bg text-fg relative overflow-hidden"
    >
      <Star className="text-fg spin-slow pointer-events-none absolute -right-16 -bottom-24 size-[22rem] opacity-[0.08] md:size-[30rem]" />
      <div className="wrap relative grid gap-8 py-20 md:grid-cols-[minmax(0,1.3fr)_minmax(0,.7fr)] md:items-end md:py-28">
        <div>
          <p className="kicker !text-current opacity-75">Hablemos</p>
          <h2 id="cta-title" className="text-h2 mt-4 font-extrabold">
            Contanos qué querés resolver. Te respondemos en {site.responseTime}.
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          <Button asChild className="border-negro bg-negro text-hueso hover:opacity-90">
            <a
              href={whatsappUrl('Hola, quiero una página web para mi negocio')}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle aria-hidden="true" /> Escribinos por WhatsApp
            </a>
          </Button>
          <Button asChild variant="outline" className="border-negro hover:bg-negro/10 text-current">
            <a href={site.formUrl} target="_blank" rel="noopener noreferrer">
              <FileText aria-hidden="true" /> Completá el formulario
            </a>
          </Button>
          <p className="text-center text-sm font-bold opacity-80">{site.whatsapp.display}</p>
        </div>
      </div>
    </section>
  );
}
