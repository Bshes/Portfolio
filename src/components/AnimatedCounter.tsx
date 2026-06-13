import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  duration?: number;
}

export default function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obj = { val: 0 };
    gsap.to(obj, {
      val: end,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      onUpdate: () => {
        el.textContent = `${prefix}${obj.val.toFixed(decimals)}${suffix}`;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [end, suffix, prefix, decimals, duration]);

  return <span ref={ref}>0</span>;
}
