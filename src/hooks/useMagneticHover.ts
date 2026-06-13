import { useRef, useCallback, useEffect } from 'react';
import gsap from 'gsap';

interface MagneticOptions {
  strength?: number;
  radius?: number;
}

export function useMagneticHover<T extends HTMLElement>(options: MagneticOptions = {}) {
  const ref = useRef<T>(null);
  const { strength = 0.3, radius = 150 } = options;

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      if (distance > radius) {
        gsap.to(el, {
          x: 0,
          y: 0,
          duration: 0.4,
          ease: 'power2.out',
        });
        return;
      }

      const power = Math.min(1, (radius - distance) / radius) * strength;
      gsap.to(el, {
        x: deltaX * power,
        y: deltaY * power,
        duration: 0.4,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    },
    [strength, radius],
  );

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return ref;
}
