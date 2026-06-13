import SEO from '@/components/SEO';
import { useState, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ExternalLink, Sparkles, ArrowRight } from 'lucide-react';
import { caseStudies, type CaseStudy } from '@/data/work';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const CaseStudyModal = lazy(() => import('@/components/CaseStudyModal'));

export default function Work() {
  const [selected, setSelected] = useState<CaseStudy | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = gridRef.current.querySelectorAll('.work-card');
    gsap.fromTo(
      cards,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }, []);

  return (
    <main className="pt-24">
      <SEO
        title="Work"
        description="Explore case studies showcasing AI-enhanced web design projects by Saino. Real results, measurable impact."
        path="/work"
      />
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-magenta mb-4">
              <ExternalLink size={14} />
              Portfolio
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Case Studies
            </h1>
            <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
              Each project is a story of transformation. Explore how we've helped
              businesses achieve remarkable results.
            </p>
          </motion.div>

          {/* Grid */}
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-5xl mx-auto">
            {caseStudies.map((study) => (
              <motion.div
                key={study.id}
                layoutId={`card-${study.id}`}
                onClick={() => setSelected(study)}
                className="work-card group relative rounded-2xl overflow-hidden cursor-pointer h-72"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />
                <div className="absolute inset-0 glass opacity-70 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {study.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 rounded-md glass text-xs text-fg-muted">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-display text-xl font-bold mb-1 group-hover:text-accent-cyan transition-colors">{study.title}</h3>
                  <p className="text-sm text-fg-muted">{study.client}</p>
                  <span className="text-xs text-accent-cyan/80 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">Click to explore →</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selected && (
          <Suspense fallback={null}>
            <CaseStudyModal study={selected} onClose={() => setSelected(null)} />
          </Suspense>
        )}
      </AnimatePresence>

      {/* Bottom CTA */}
      <section className="pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-fg-muted mb-4">Want to see your project here?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-deep font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start Your Project
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
