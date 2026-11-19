import { About } from '@/components/sections/About';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Faq } from '@/components/sections/Faq';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { SectionIndex } from '@/components/layout/SectionIndex';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
import { Included } from '@/components/sections/Included';
import { Industries } from '@/components/sections/Industries';
import { Statement } from '@/components/sections/Statement';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { Testimonials } from '@/components/sections/Testimonials';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProjects } from '@/lib/projects';
import { faqJsonLd } from '@/lib/seo';

export default async function HomePage() {
  const projects = await getProjects();
  return (
    <>
      <Hero projectCount={projects.length} />
      <div className="overflow-hidden">
        <Marquee />
      </div>
      <FeaturedProjects projects={projects} />
      <Services />
      <Included />
      <Statement />
      <Industries />
      <Process />
      <About />
      <Testimonials />
      <Faq />
      <ContactCTA />
      <SectionIndex
        items={[
          { id: 'hero-title', label: 'Inicio' },
          { id: 'proyectos-title', label: 'Proyectos' },
          { id: 'servicios-title', label: 'Servicios' },
          { id: 'incluido-title', label: 'Incluido' },
          { id: 'rubros-title', label: 'Rubros' },
          { id: 'proceso-title', label: 'Proceso' },
          { id: 'estudio-title', label: 'Estudio' },
          { id: 'faq-title', label: 'Preguntas' },
          { id: 'cta-title', label: 'Contacto' },
        ]}
      />
      <JsonLd data={faqJsonLd()} />
    </>
  );
}
