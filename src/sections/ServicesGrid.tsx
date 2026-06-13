import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Zap, Cpu, Globe, Palette, Code, Shield } from 'lucide-react';
import { useStaggerAnimation } from '@/hooks/useScrollAnimation';

const services = [
  {
    icon: Globe,
    title: 'Web Design & Development',
    description: 'Custom, high-performance websites built with cutting-edge technology. From WebGL to GSAP, we craft experiences that load fast and look incredible.',
    gradient: 'from-cyan-500/20 to-blue-600/20',
    borderGlow: 'shadow-cyan-500/10',
  },
  {
    icon: Palette,
    title: 'AI Brand Identity',
    description: 'Intelligent brand systems that adapt and evolve. AI-assisted logo generation, color palettes, and typography that capture your essence.',
    gradient: 'from-purple-500/20 to-pink-600/20',
    borderGlow: 'shadow-purple-500/10',
  },
  {
    icon: Cpu,
    title: '3D & WebGL Experiences',
    description: 'Immersive 3D product viewers, interactive data visualizations, and GPU-accelerated shaders that push the boundaries of the browser.',
    gradient: 'from-emerald-500/20 to-teal-600/20',
    borderGlow: 'shadow-emerald-500/10',
  },
  {
    icon: Zap,
    title: 'AI Automation Integration',
    description: 'Smart chatbots, automated workflows, and AI-powered analytics. Reduce manual work and let intelligent systems handle the heavy lifting.',
    gradient: 'from-orange-500/20 to-rose-600/20',
    borderGlow: 'shadow-orange-500/10',
  },
  {
    icon: Sparkles,
    title: 'Motion & Animation',
    description: 'Scroll-driven storytelling, kinetic typography, and micro-interactions that guide users through your narrative with purpose and beauty.',
    gradient: 'from-cyan-500/20 to-purple-600/20',
    borderGlow: 'shadow-cyan-500/10',
  },
  {
    icon: Shield,
    title: 'Performance & SEO',
    description: 'Lighthouse 100 optimization, Core Web Vitals mastery, and AI-driven SEO strategy. Your site won\'t just look good — it will be found.',
    gradient: 'from-amber-500/20 to-yellow-600/20',
    borderGlow: 'shadow-amber-500/10',
  },
];

export default function ServicesGrid() {
  const titleRef = useStaggerAnimation<HTMLDivElement>('.service-card', {
    stagger: 0.1,
    start: 'top 80%',
  });

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan mb-4">
            <Zap size={14} />
            What I Do
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            Services
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Every service is infused with AI intelligence and crafted with human creativity.
            This is design, amplified.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          ref={titleRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              className="service-card group relative rounded-2xl p-6 glass border border-glass-border hover:border-accent-cyan/20 transition-all duration-500 hover:-translate-y-1"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl glass flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <service.icon size={22} className="text-accent-cyan" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{service.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            to="/services"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl glass text-sm font-medium text-accent-cyan border border-accent-cyan/20 hover:bg-accent-cyan/5 transition-all duration-300"
          >
            View Full Service Details
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
