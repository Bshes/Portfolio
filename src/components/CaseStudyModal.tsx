import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, TrendingUp, Clock, Users } from 'lucide-react';
import type { CaseStudy } from '@/data/work';

const resultIcons = [TrendingUp, Clock, Users];

export default function CaseStudyModal({ study, onClose }: { study: CaseStudy; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-deep/80 backdrop-blur-xl" />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 40 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl glass border border-glass-border p-6 md:p-8"
      >
        <button onClick={onClose} className="absolute top-4 right-4 w-10 h-10 rounded-xl glass flex items-center justify-center text-fg-muted hover:text-fg-primary transition-colors">
          <X size={18} />
        </button>

        <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${study.gradient} text-white mb-4`}>
          {study.category}
        </div>
        <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">{study.title}</h3>
        <p className="text-fg-muted mb-6">{study.client}</p>

        <div className="space-y-6">
          <div>
            <h4 className="font-display font-semibold text-sm text-accent-cyan mb-2">The Challenge</h4>
            <p className="text-sm text-fg-secondary leading-relaxed">{study.challenge}</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm text-accent-cyan mb-2">The Solution</h4>
            <p className="text-sm text-fg-secondary leading-relaxed">{study.solution}</p>
          </div>
          <div>
            <h4 className="font-display font-semibold text-sm text-accent-gold mb-3">Results</h4>
            <div className="grid grid-cols-3 gap-3">
              {study.results.map((r, i) => {
                const Icon = resultIcons[i] || TrendingUp;
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
          <div className="flex flex-wrap gap-2">
            {study.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 rounded-full glass text-xs text-fg-secondary">{tag}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
