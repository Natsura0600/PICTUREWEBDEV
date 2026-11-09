import { ContactForm } from '@/components/contact/ContactForm';
import { Button } from '@/components/ui/button';
import { pageMetadata } from '@/lib/seo';
import { plans, site, whatsappUrl } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Contacto',
  description: `Contanos tu idea y te respondemos en ${site.responseTime} con una propuesta para tu negocio. También por WhatsApp.`,
  path: '/contacto',
});

type Props = { searchParams: Promise<{ plan?: string | string[] }> };

export default async function ContactPage({ searchParams }: Props) {
  const { plan } = await searchParams;
  const chosen = plans.find((p) => p.id === (Array.isArray(plan) ? plan[0] : plan));

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
          {chosen ? (
            <p className="rounded-marca border-line mt-6 border p-4 text-sm">
              Elegiste el plan <strong>{chosen.name}</strong>: {chosen.setup} + {chosen.monthly}/mes.
            </p>
          ) : null}
          <div className="border-line mt-10 grid gap-3 border-t pt-6">
            <p className="kicker">¿Preferís hablar directo?</p>
            <Button asChild variant="whatsapp" className="justify-self-start">
              <a
                href={whatsappUrl('Hola, quiero una página web para mi negocio')}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp {site.whatsapp.display}
              </a>
            </Button>
            <p className="text-muted text-sm">
              {site.name} · {site.city}, {site.region}
            </p>
          </div>
        </div>
        <div className="min-w-0">
          <ContactForm defaultTipo={chosen?.tipo} />
        </div>
      </div>
    </section>
  );
}
