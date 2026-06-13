import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { testimonials } from '@/data/testimonials';

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const goTo = (index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  };

  const goNext = () => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const goPrev = () => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const t = testimonials[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section className="section-padding relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-gold mb-4">
            <Quote size={14} />
            Testimonials
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Kind Words
          </h2>
        </motion.div>

        {/* Carousel */}
        <div className="relative glass rounded-3xl p-8 md:p-12 border border-glass-border min-h-[280px]">
          {/* Decorative quote */}
          <Quote size={48} className="absolute top-4 right-4 text-accent-cyan/10" />

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-center"
              >
                {/* Stars */}
                <div className="flex justify-center gap-1 mb-6">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} className="text-accent-gold fill-accent-gold" />
                  ))}
                </div>

                <p className="text-lg md:text-xl text-fg-secondary leading-relaxed mb-8 italic">
                  "{t.content}"
                </p>

                <div className="flex items-center justify-center gap-4">
                  <div className="w-12 h-12 rounded-full glass flex items-center justify-center font-display font-bold text-accent-cyan">
                    {t.avatar}
                  </div>
                  <div className="text-left">
                    <div className="font-display font-semibold text-fg-primary">{t.name}</div>
                    <div className="text-sm text-fg-muted">{t.role}, {t.company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={goPrev}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-fg-muted hover:text-accent-cyan transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'bg-accent-cyan w-6'
                      : 'bg-glass-border hover:bg-fg-muted'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={goNext}
              className="w-10 h-10 rounded-xl glass flex items-center justify-center text-fg-muted hover:text-accent-cyan transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
