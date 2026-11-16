import { ArrowUpRight } from 'lucide-react';
import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { site, whatsappUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Contacto',
  description: `Contanos tu idea y te respondemos en ${site.responseTime} con una propuesta para tu negocio. También por WhatsApp.`,
  path: '/contacto',
});

export default function ContactPage() {
  return (
    <section className="wrap pt-14 pb-20 md:pt-20 md:pb-28">
      <div className="grid gap-12 md:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] md:gap-20">
        <div className="min-w-0">
          <p className="kicker">Contacto</p>
          <h1 className="text-h2 mt-4 font-extrabold">Contanos qué querés hacer posible.</h1>
          <p className="text-muted mt-6 max-w-[46ch] md:text-lg">
            Leemos cada consulta y te respondemos en {site.responseTime} con preguntas concretas o una
            propuesta con precio y plazo.
          </p>
          <div className="border-line mt-10 grid gap-3 border-t pt-6">
            <p className="kicker">¿Preferís otra vía?</p>
            <Button asChild variant="whatsapp" className="justify-self-start">
              <a
                href={whatsappUrl('Hola, quiero una página web para mi negocio')}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {site.whatsapp.display}
              </a>
            </Button>
            <Button asChild variant="outline" className="justify-self-start">
              <a href={site.formUrl} target="_blank" rel="noopener noreferrer">
                Completar el formulario <ArrowUpRight aria-hidden="true" />
              </a>
            </Button>
            <p className="text-muted text-sm">
              {site.name} · {site.city}, {site.region}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
