import SEO from '@/components/SEO';
import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, Sparkles, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { servicePackages, addons } from '@/data/services';
import { useMagneticHover } from '@/hooks/useMagneticHover';

gsap.registerPlugin(ScrollTrigger);

function PricingCard({ pkg, index }: { pkg: typeof servicePackages[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const ctaRef = useMagneticHover<HTMLAnchorElement>({ strength: 0.3 });

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      },
    );
  }, [index]);

  return (
    <div
      ref={cardRef}
      className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-500 ${
        pkg.highlighted
          ? 'glass border-accent-cyan/30 shadow-lg shadow-accent-cyan/5 scale-105'
          : 'glass border-glass-border hover:border-accent-cyan/20'
      }`}
    >
      {/* Badge */}
      {pkg.badge && (
        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-medium ${
          pkg.highlighted
            ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-deep'
            : 'glass text-fg-muted'
        }`}>
          {pkg.badge}
        </div>
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="font-display text-xl font-bold mb-1">{pkg.name}</h3>
        <p className="text-sm text-fg-muted mb-4">{pkg.tagline}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="font-display text-4xl font-bold">${pkg.price.toLocaleString()}</span>
          <span className="text-sm text-fg-muted">/{pkg.period}</span>
        </div>
        <p className="text-xs text-fg-muted mt-4 max-w-xs mx-auto">{pkg.description}</p>
      </div>

      {/* Features */}
      <ul className="space-y-3 mb-8">
        {pkg.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-fg-muted">
            <Check size={16} className="text-accent-cyan shrink-0 mt-0.5" />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        ref={ctaRef}
        to="/contact"
        className={`block w-full py-3 rounded-xl text-center text-sm font-semibold transition-all duration-300 ${
          pkg.highlighted
            ? 'bg-gradient-to-r from-accent-cyan to-accent-purple text-deep hover:opacity-90'
            : 'glass text-fg-primary border border-glass-border hover:border-accent-cyan/30'
        }`}
      >
        Get Started
      </Link>
    </div>
  );
}

export default function Services() {
  return (
    <main className="pt-24">
      <SEO
        title="Services"
        description="Transparent pricing for AI-enhanced web design. Choose from three packages — Starter, Growth, Enterprise — plus powerful add-ons."
        path="/services"
      />
      {/* Header */}
      <section className="section-padding pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan mb-4">
              <Sparkles size={14} />
              Pricing
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold mb-4">
              Transparent Pricing
            </h1>
            <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
              No hidden fees. No surprises. Every package includes our signature
              AI-enhanced design approach and white-glove service.
            </p>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto items-start">
            {servicePackages.map((pkg, i) => (
              <PricingCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="section-padding pt-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-gold mb-4">
              <Zap size={14} />
              Add-ons
            </span>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Supercharge Your Package
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {addons.map((addon, i) => (
              <motion.div
                key={addon.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="glass rounded-xl p-4 border border-glass-border text-center"
              >
                <div className="text-lg font-display font-bold text-accent-cyan">${addon.price.toLocaleString()}</div>
                <div className="text-sm font-medium text-fg-primary mb-1">{addon.name}</div>
                <div className="text-xs text-fg-muted">{addon.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm text-fg-muted mb-4">Not sure which package fits?</p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-accent-purple text-deep font-semibold text-sm hover:opacity-90 transition-opacity"
          >
            Let's Talk
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
