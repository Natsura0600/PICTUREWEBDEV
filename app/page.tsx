import { About } from '@/components/sections/About';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Faq } from '@/components/sections/Faq';
import { FeaturedProjects } from '@/components/sections/FeaturedProjects';
import { Hero } from '@/components/sections/Hero';
import { Marquee } from '@/components/sections/Marquee';
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
      <Hero />
      <div className="overflow-hidden py-6">
        <Marquee />
      </div>
      <FeaturedProjects projects={projects} />
      <Services />
      <Process />
      <About />
      <Testimonials />
      <Faq />
      <ContactCTA />
      <JsonLd data={faqJsonLd()} />
    </>
  );
}
