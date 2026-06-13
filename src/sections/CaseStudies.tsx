import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, TrendingUp, Clock, Users } from 'lucide-react';
import { caseStudies, type CaseStudy } from '@/data/work';

const icons = [TrendingUp, Clock, Users];

export default function CaseStudies() {
  const [selected, setSelected] = useState<CaseStudy | null>(null);

  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-magenta mb-4">
            <ExternalLink size={14} />
            Case Studies
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Selected Work
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Real projects, real results. Each case study showcases the intersection of
            AI innovation and design excellence.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {caseStudies.map((study, i) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              onClick={() => setSelected(study)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer h-80"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-30 group-hover:opacity-50 transition-opacity duration-500`} />

              {/* Glass overlay */}
              <div className="absolute inset-0 glass opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-end p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {study.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md glass text-xs text-fg-muted"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-display text-xl font-bold mb-1 group-hover:text-accent-cyan transition-colors">
                  {study.title}
                </h3>
                <p className="text-sm text-fg-muted">{study.client}</p>
                <span className="text-xs text-accent-cyan/80 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Click to explore →
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              onClick={() => setSelected(null)}
            >
              <div className="absolute inset-0 bg-deep/80 backdrop-blur-xl" />
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                onClick={(e) => e.stopPropagation()}
                className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl glass border border-glass-border p-8"
              >
                {/* Close */}
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 w-10 h-10 rounded-xl glass flex items-center justify-center text-fg-muted hover:text-fg-primary transition-colors"
                >
                  <X size={18} />
                </button>

                {/* Header */}
                <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${selected.gradient} text-white mb-4`}>
                  {selected.category}
                </div>
                <h3 className="font-display text-3xl font-bold mb-2">{selected.title}</h3>
                <p className="text-fg-muted mb-6">{selected.client}</p>

                {/* Content */}
                <div className="space-y-6">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-accent-cyan mb-2">The Challenge</h4>
                    <p className="text-sm text-fg-secondary leading-relaxed">{selected.challenge}</p>
                  </div>
                  <div>
                    <h4 className="font-display font-semibold text-sm text-accent-cyan mb-2">The Solution</h4>
                    <p className="text-sm text-fg-secondary leading-relaxed">{selected.solution}</p>
                  </div>

                  {/* Results */}
                  <div>
                    <h4 className="font-display font-semibold text-sm text-accent-gold mb-3">Results</h4>
                    <div className="grid grid-cols-3 gap-3">
                      {selected.results.map((r, i) => {
                        const Icon = icons[i] || TrendingUp;
                        return (
                          <div key={r.metric} className="glass rounded-xl p-4 text-center">
                            <Icon size={18} className="mx-auto mb-2 text-accent-cyan" />
                            <div className="font-display text-xl font-bold text-gradient">{r.value}</div>
                            <div className="text-xs text-fg-muted mt-1">{r.metric}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selected.tags.map((tag) => (
                      <span key={tag} className="px-3 py-1 rounded-full glass text-xs text-fg-secondary">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
