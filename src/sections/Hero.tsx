import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles } from 'lucide-react';
import NeuralNetwork from '@/three/NeuralNetwork';
import { useMagneticHover } from '@/hooks/useMagneticHover';

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useMagneticHover<HTMLAnchorElement>({ strength: 0.4, radius: 200 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title animation - kinetic type effect
      const title = titleRef.current;
      if (title) {
        const chars = title.querySelectorAll('.char');
        gsap.fromTo(
          chars,
          { opacity: 0, y: 80, rotateX: -40 },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            stagger: 0.03,
            ease: 'power4.out',
            delay: 0.3,
          },
        );
      }

      // Subtitle
      gsap.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, delay: 1.2, ease: 'power3.out' },
      );

      // CTA
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, delay: 1.6, ease: 'power3.out' },
      );

      // Stats
      gsap.fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          delay: 2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Neural Network Background */}
      <NeuralNetwork />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-deep/20 via-deep/50 to-deep pointer-events-none z-[1]" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan mb-8 animate-float">
            <Sparkles size={14} />
            AI-Powered Web Design Studio
          </div>

          {/* Kinetic Typography Title */}
          <h1
            ref={titleRef}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight"
          >
            {'Where AI Meets'.split('').map((char, i) => (
              <span key={i} className="char inline-block" style={{ perspective: '800px' }}>
                {char === ' ' ? '\u00A0' : char}
              </span>
            ))}
            <br />
            <span className="text-gradient inline-block mt-2">
              {'Digital Artistry'.split('').map((char, i) => (
                <span key={i} className="char inline-block" style={{ perspective: '800px' }}>
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="text-lg sm:text-xl text-fg-secondary max-w-2xl mt-6 leading-relaxed"
          >
            I'm <span className="text-fg-primary font-semibold">Saino</span> — I craft
            immersive, AI-enhanced digital experiences that captivate audiences and
            drive results. No templates. No limits. Just pure creativity, engineered.
          </p>

          {/* CTAs */}
          <div ref={ctaRef} className="flex flex-wrap gap-4 mt-10">
            <Link
              ref={ctaBtnRef}
              to="/work"
              className="group relative px-8 py-4 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-deep font-semibold text-sm overflow-hidden transition-transform duration-300 hover:scale-105"
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            </Link>
            <Link
              to="/services"
              className="px-8 py-4 rounded-xl glass text-fg-primary font-semibold text-sm border border-glass-border hover:border-accent-cyan/30 transition-all duration-300"
            >
              Explore Services
            </Link>
          </div>
          </div>

        {/* Stats */}
        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 md:mt-28"
        >
          {[
            { value: '50+', label: 'Projects Delivered' },
            { value: '98%', label: 'Client Satisfaction' },
            { value: '12x', label: 'Avg. ROI Multiplier' },
            { value: '24hr', label: 'Avg. Response Time' },
          ].map((stat, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center">
              <div className="font-display text-2xl md:text-3xl font-bold text-gradient">
                {stat.value}
              </div>
              <div className="text-xs text-fg-muted mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-float">
        <span className="text-xs text-fg-muted tracking-widest uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent-cyan to-transparent" />
      </div>
    </section>
  );
}
