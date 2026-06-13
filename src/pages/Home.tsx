import SEO from '@/components/SEO';
import Hero from '@/sections/Hero';
import MascotShowcase from '@/sections/MascotShowcase';
import ServicesGrid from '@/sections/ServicesGrid';
import CaseStudies from '@/sections/CaseStudies';
import ProcessTimeline from '@/sections/ProcessTimeline';
import Testimonials from '@/sections/Testimonials';
import AboutMe from '@/sections/AboutMe';
import ContactForm from '@/sections/ContactForm';
import ShaderPlayground from '@/sections/ShaderPlayground';

export default function Home() {
  return (
    <main>
      <SEO
        title="Home"
        description="Saino is an AI-powered web design studio crafting immersive, award-caliber digital experiences. No templates. No limits. Pure creativity, engineered."
        path="/"
      />
      <Hero />
      <MascotShowcase />
      <ServicesGrid />
      <CaseStudies />
      <ProcessTimeline />
      <Testimonials />
      <AboutMe />
      <ContactForm />
      <ShaderPlayground />
    </main>
  );
}
