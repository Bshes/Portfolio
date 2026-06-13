import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function ThreeDScene() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!loaded) return <div className="absolute inset-0 flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-accent-cyan/30 border-t-accent-cyan animate-spin" /></div>;

  return (
    <>
      {/* We avoid static imports — these are code-split at the bundler level
          via the three-vendor chunk which is only pulled in when this renders */}
      <LazyGPUParticles />
      <LazyNeuralMascot />
    </>
  );
}

const LazyGPUParticles = (() => {
  let Component: React.ComponentType<{ className?: string }> | null = null;
  return function LazyGPUParticlesInner() {
    const [Loaded, setLoaded] = useState<React.ComponentType<{ className?: string }> | null>(null);
    useEffect(() => {
      if (Component) { setLoaded(() => Component); return; }
      import('@/three/GPUParticles').then(m => {
        Component = m.default;
        setLoaded(() => Component!);
      });
    }, []);
    return Loaded ? <Loaded /> : null;
  };
})();

const LazyNeuralMascot = (() => {
  let Component: React.ComponentType | null = null;
  return function LazyNeuralMascotInner() {
    const [Loaded, setLoaded] = useState<React.ComponentType | null>(null);
    useEffect(() => {
      if (Component) { setLoaded(() => Component); return; }
      import('@/three/NeuralMascot').then(m => {
        Component = m.default;
        setLoaded(() => Component!);
      });
    }, []);
    return Loaded ? <Loaded /> : null;
  };
})();

export default function MascotShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (textRef.current) {
        gsap.fromTo(
          textRef.current.querySelectorAll('.reveal-line'),
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: textRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          },
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="section-padding relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-cyan/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <motion.div
            ref={textRef}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan mb-6">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="6" cy="6" r="2" fill="currentColor" />
              </svg>
              Interactive 3D
            </span>

            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 reveal-line">
              A Sculpture That
              <br />
              <span className="text-gradient">Breathes With You</span>
            </h2>

            <p className="text-fg-secondary text-lg leading-relaxed mb-6 reveal-line">
              Every vertex responds to your presence. The neural sculpture morphs, pulses, and
              glows — a living embodiment of the AI-driven creativity that powers every project.
            </p>

            <div className="space-y-4 reveal-line">
              {[
                { label: 'Procedural Geometry', desc: '2,562 vertices animated by simplex noise' },
                { label: 'Custom GLSL Shaders', desc: 'Fresnel glow with real-time color mixing' },
                { label: 'Mouse-Responsive', desc: 'Organic deformation follows your cursor' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan mt-2 shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-fg-primary">{item.label}</div>
                    <div className="text-xs text-fg-muted">{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right: 3D Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px]"
          >
            <div className="absolute inset-0 scale-110">
              <ThreeDScene />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
