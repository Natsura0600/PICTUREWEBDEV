import { ContactCTA } from '@/components/sections/ContactCTA';
import { Faq } from '@/components/sections/Faq';
import { Plans } from '@/components/sections/Plans';
import { Process } from '@/components/sections/Process';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Services } from '@/components/sections/Services';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Servicios y planes',
  description:
    'Sitios web, sistemas de turnos y pedidos, paneles a medida y mantenimiento. Planes con pago inicial desde USD 150 y abono mensual desde USD 20.',
  path: '/servicios',
});

export default function ServicesPage() {
  return (
    <>
      <section className="wrap pt-14 md:pt-20">
        <SectionHeading
          as="h1"
          kicker="Servicios"
          title={
            <>
              Todo lo que tu negocio necesita <span className="text-muted">para vender online.</span>
            </>
          }
          lead="Desde una landing clara hasta un sistema de turnos con panel propio. Te decimos qué te conviene según tu negocio, aunque sea lo más simple."
          className="mb-0 md:mb-0"
        />
      </section>
      <div className="mt-16 md:mt-20">
        <Services withHeading={false} />
      </div>
      <Plans kicker="Planes" />
      <Process kicker="Proceso" />
      <Faq />
      <ContactCTA />
      <JsonLd data={faqJsonLd()} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Inicio', path: '/' },
          { name: 'Servicios', path: '/servicios' },
        ])}
      />
    </>
  );
}
