import SEO from '@/components/SEO';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, Layers, Palette, Code, Search, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';
import { processSteps } from '@/data/process';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Search, Layers, Palette, Code, Rocket, RefreshCw,
};

export default function Process() {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          duration: 2,
          ease: 'power3.inOut',
          scrollTrigger: {
            trigger: lineRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1,
          },
        },
      );
    }
  }, []);

  return (
    <main className="pt-24">
      <SEO
        title="Process"
        description="Saino's 6-step design process: from discovery to launch. See how we bring clarity from complexity with AI-powered methodology."
        path="/process"
      />
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-purple mb-4">
              <Rocket size={14} />
              Methodology
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              The Process
            </h1>
            <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
              Every pixel, every interaction, every animation is intentional.
              Here's how we bring clarity from complexity.
            </p>
          </motion.div>

          {/* Process cards */}
          <div className="relative max-w-4xl mx-auto">
            {/* Progress line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-glass-border origin-top">
              <div
                ref={lineRef}
                className="w-full h-full bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-magenta origin-top"
                style={{ transform: 'scaleY(0)' }}
              />
            </div>

            <div className="space-y-12 md:space-y-20">
              {processSteps.map((step, i) => {
                const Icon = iconMap[step.icon] || Layers;
                const isEven = i % 2 === 0;

                return (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0, x: isEven ? -40 : 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start gap-6 ${
                      isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                  >
                    <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full glass border-2 border-accent-cyan z-10 mt-6" />
                    <div className="hidden md:block md:w-1/2" />
                    <div className={`ml-10 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                      <div className="glass rounded-2xl p-6 md:p-8 border border-glass-border hover:border-accent-cyan/20 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl glass flex items-center justify-center">
                            <Icon size={20} className="text-accent-cyan" />
                          </div>
                          <div>
                            <span className="text-xs text-accent-cyan font-mono">Step {step.id}</span>
                            <span className="text-xs text-fg-muted ml-2">{step.duration}</span>
                          </div>
                        </div>
                        <h3 className="font-display text-xl font-bold mb-1">{step.title}</h3>
                        <p className="text-sm text-fg-muted mb-3">{step.subtitle}</p>
                        <p className="text-sm text-fg-secondary leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-fg-muted mb-4">Ready to start your journey?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-deep font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Start a Project
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
