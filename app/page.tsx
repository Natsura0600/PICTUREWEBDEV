import { SectionIndex } from '@/components/layout/SectionIndex';
import { About } from '@/components/sections/About';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Faq } from '@/components/sections/Faq';
import { HeroSlider, type HeroSlide } from '@/components/sections/HeroSlider';
import { Included } from '@/components/sections/Included';
import { Industries } from '@/components/sections/Industries';
import { Marquee } from '@/components/sections/Marquee';
import { Process } from '@/components/sections/Process';
import { Services } from '@/components/sections/Services';
import { Statement } from '@/components/sections/Statement';
import { Testimonials } from '@/components/sections/Testimonials';
import { JsonLd } from '@/components/seo/JsonLd';
import { getProjects, type Project } from '@/lib/projects';
import { faqJsonLd } from '@/lib/seo';

/** Colores de respaldo si un proyecto no define el suyo. */
const PALETTE = ['#C2B0DC', '#B4D58A', '#F3DA8A', '#F2AFC0', '#A9CBEA'];

/** Solo entran a la portada los proyectos con capturas propias de celular y de compu. */
function toSlide(p: Project, i: number): HeroSlide | null {
  const mobile = p.images.find((img) => img.device === 'mobile');
  const desktop = p.images.find((img) => img.device === 'desktop');
  if (!mobile || !desktop) return null;
  const { meta } = p;
  return {
    slug: p.slug,
    title: meta.title,
    short: meta.short ?? meta.title,
    word: meta.word ?? meta.title,
    color: meta.color ?? PALETTE[i % PALETTE.length]!,
    chips: [meta.services[1] ?? meta.kind, meta.services[2] ?? meta.services[0] ?? meta.kind],
    mobile: { src: mobile.src, blur: mobile.blur },
    desktop: { src: desktop.src, blur: desktop.blur },
  };
}

export default async function HomePage() {
  const projects = await getProjects();
  const slides = projects.map(toSlide).filter((s): s is HeroSlide => s !== null);

  return (
    <>
      <HeroSlider slides={slides} />
      <div className="overflow-hidden">
        <Marquee />
      </div>
      <div data-tone="lilac">
        <Services kicker="01 · Servicios" />
      </div>
      <div data-tone="mint">
        <Included kicker="02 · Incluido" />
      </div>
      <Statement />
      <div data-tone="sky">
        <Industries kicker="03 · Rubros" />
      </div>
      <div data-tone="pink">
        <Process kicker="04 · Cómo trabajamos" />
      </div>
      <div data-tone="butter">
        <About kicker="05 · El estudio" />
      </div>
      <Testimonials />
      <div data-tone="lilac">
        <Faq />
      </div>
      <ContactCTA />
      <SectionIndex
        items={[
          { id: 'hero-title', label: 'Inicio' },
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
