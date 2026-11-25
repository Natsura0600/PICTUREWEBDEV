import { SectionIndex } from '@/components/layout/SectionIndex';
import { About } from '@/components/sections/About';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Faq } from '@/components/sections/Faq';
import { Hero } from '@/components/sections/Hero';
import { Process } from '@/components/sections/Process';
import { ProjectsSlider, type ProjectSlide } from '@/components/sections/ProjectsSlider';
import { Solutions } from '@/components/sections/Solutions';
import { Testimonials } from '@/components/sections/Testimonials';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProjects, type Project } from '@/lib/projects';
import { faqJsonLd } from '@/lib/seo';

/** Color de respaldo si un proyecto no define el suyo (el dorado de la marca). */
const FALLBACK_COLOR = '#FFC21A';

/** Solo entran al slider los proyectos con capturas propias de celular y de compu. */
function toSlide(p: Project): ProjectSlide | null {
  const mobile = p.images.find((img) => img.device === 'mobile');
  const desktop = p.images.find((img) => img.device === 'desktop');
  if (!mobile || !desktop) return null;
  const { meta } = p;
  return {
    slug: p.slug,
    title: meta.title,
    short: meta.short ?? meta.title,
    word: meta.word ?? meta.title,
    color: meta.color ?? FALLBACK_COLOR,
    chips: [meta.services[1] ?? meta.kind, meta.services[2] ?? meta.services[0] ?? meta.kind],
    mobile: { src: mobile.src, blur: mobile.blur },
    desktop: { src: desktop.src, blur: desktop.blur },
  };
}

/**
 * Inicio, pensado para vender en pocos pasos:
 * qué hacemos → qué necesita tu negocio (con su WhatsApp) → trabajos reales → cómo trabajamos →
 * quién está detrás → dudas → contacto.
 */
export default async function HomePage() {
  const projects = await getProjects();
  const slides = projects.map(toSlide).filter((s): s is ProjectSlide => s !== null);

  return (
    <>
      <Hero projectCount={projects.length} />
      <Solutions />
      <ProjectsSlider slides={slides} />
      <Process kicker="03 · Cómo trabajamos" />
      <About kicker="04 · El estudio" />
      <Testimonials />
      <Faq />
      <ContactCTA />
      <SectionIndex
        items={[
          { id: 'hero-title', label: 'Inicio' },
          { id: 'soluciones-title', label: 'Soluciones' },
          { id: 'proyectos-title', label: 'Proyectos' },
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
