import SEO from '@/components/SEO';
import AboutMe from '@/sections/AboutMe';
import Testimonials from '@/sections/Testimonials';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <main className="pt-24">
      <SEO
        title="About"
        description="Meet Saino — a designer who codes, a developer who designs. AI-powered creativity at the intersection of technology and art."
        path="/about"
      />
      {/* Extra header */}
      <section className="section-padding pb-0">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto mb-8">
            A designer who codes, a developer who designs. I live at the intersection
            of creativity and technology, powered by AI.
          </p>
        </motion.div>
      </section>

      <AboutMe />
      <Testimonials />
    </main>
  );
}
