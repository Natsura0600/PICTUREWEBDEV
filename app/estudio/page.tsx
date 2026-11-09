import { About } from '@/components/sections/About';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Process } from '@/components/sections/Process';
import { SectionHeading } from '@/components/sections/SectionHeading';
import { Testimonials } from '@/components/sections/Testimonials';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'El estudio',
  description: `Picture Web Dev es el estudio de ${site.founder.name}, desarrollador web en Luján. Diseño y desarrollo de punta a punta, con trato directo.`,
  path: '/estudio',
});

export default function StudioPage() {
  return (
    <>
      <section className="wrap pt-14 md:pt-20">
        <SectionHeading
          as="h1"
          kicker="El estudio"
          title={
            <>
              Un estudio chico, <span className="hl">a propósito.</span>
            </>
          }
          lead="Pocos proyectos a la vez, para dedicarle a cada uno el tiempo que necesita. Diseño y código hechos por la misma persona que te atiende."
          className="mb-0 md:mb-0"
        />
      </section>
      <div className="mt-16 md:mt-20">
        <About kicker="Quién está detrás" full />
      </div>
      <Process kicker="Cómo trabajamos" />
      <Testimonials />
      <ContactCTA />
    </>
  );
}
