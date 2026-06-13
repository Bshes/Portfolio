import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.98,
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate in
    const container = containerRef.current;
    if (container) {
      gsap.fromTo(
        container,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', clearProps: 'transform' },
      );
    }
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        ref={containerRef}
        data-page-container
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
