import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'framer-motion';
import { processSteps } from '@/data/process';
import { Search, Layers, Palette, Code, Rocket, RefreshCw } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const iconMap: Record<string, React.ElementType> = {
  Search, Layers, Palette, Code, Rocket, RefreshCw,
};

export default function ProcessTimeline() {
  const lineRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress line animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            duration: 1.5,
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

      // Step cards
      stepsRef.current.forEach((step, i) => {
        if (!step) return;
        gsap.fromTo(
          step,
          { opacity: 0, x: i % 2 === 0 ? -60 : 60 },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: step,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-purple mb-4">
            <Rocket size={14} />
            Methodology
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            How I Work
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            A proven 6-phase process that transforms your vision into a
            stunning digital reality.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-glass-border origin-top">
            <div
              ref={lineRef}
              className="w-full h-full bg-gradient-to-b from-accent-cyan via-accent-purple to-accent-magenta origin-top"
              style={{ transform: 'scaleY(0)' }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-8 md:space-y-16">
            {processSteps.map((step, i) => {
              const Icon = iconMap[step.icon] || Layers;
              const isEven = i % 2 === 0;

              return (
                <div
                  key={step.id}
                  ref={(el) => { stepsRef.current[i] = el; }}
                  className={`relative flex flex-col md:flex-row items-start gap-6 ${
                    isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Connector dot */}
                  <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full glass border-2 border-accent-cyan z-10 mt-6" />

                  {/* Spacer for alignment */}
                  <div className="hidden md:block md:w-1/2" />

                  {/* Card */}
                  <div className={`ml-10 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="glass rounded-2xl p-6 border border-glass-border hover:border-accent-cyan/20 transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl glass flex items-center justify-center">
                          <Icon size={18} className="text-accent-cyan" />
                        </div>
                        <div>
                          <span className="text-xs text-accent-cyan font-mono">
                            Step {step.id}
                          </span>
                          <span className="text-xs text-fg-muted ml-2">
                            {step.duration}
                          </span>
                        </div>
                      </div>
                      <h3 className="font-display font-semibold text-lg mb-1">{step.title}</h3>
                      <p className="text-xs text-fg-muted mb-2">{step.subtitle}</p>
                      <p className="text-sm text-fg-secondary leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
