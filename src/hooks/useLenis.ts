import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { useReducedMotion } from './useReducedMotion';

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    // Sync GSAP ScrollTrigger with Lenis
    function onRaf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(onRaf);
    }
    requestAnimationFrame(onRaf);

    // Connect GSAP ScrollTrigger
    if (typeof window !== 'undefined') {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        lenis.on('scroll', ScrollTrigger.update);
        ScrollTrigger.scrollerProxy(document.body, {
          scrollTop(value) {
            if (arguments.length) {
              lenis.scrollTo(value as number, { immediate: true });
            }
            return lenis.scroll;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
          pinType: document.body.style.transform ? 'transform' : 'fixed',
        });
      });
    }

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  const scrollTo = (target: string | HTMLElement | number, options = {}) => {
    lenisRef.current?.scrollTo(target, options);
  };

  return { scrollTo, lenis: lenisRef };
}
