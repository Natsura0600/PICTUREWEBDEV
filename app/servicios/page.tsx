import { Faq } from '@/components/sections/Faq';
import { Included } from '@/components/sections/Included';
import { Process } from '@/components/sections/Process';
import { Solutions } from '@/components/sections/Solutions';
import { JsonLd } from '@/components/seo/JsonLd';
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Servicios',
  description:
    'Sitios web, sistemas de turnos y pedidos, agente de IA para WhatsApp, manejo de Instagram y mantenimiento. Pedí tu presupuesto sin compromiso.',
  path: '/servicios',
});

export default function ServicesPage() {
  return (
    <>
      <div className="[&>section]:border-t-0 [&>section]:pt-14 md:[&>section]:pt-20">
        <Solutions kicker="Servicios" headingAs="h1" detailLink={false} />
      </div>
      <Included kicker="Incluido" />
      <Process kicker="Proceso" />
      <Faq />
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
