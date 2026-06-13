import { useEffect, useRef, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollAnimationOptions {
  trigger?: RefObject<HTMLElement | null>;
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  scrub?: boolean | number;
  markers?: boolean;
  start?: string;
  end?: string;
  toggleActions?: string;
}

export function useScrollAnimation<T extends HTMLElement>(
  options: ScrollAnimationOptions,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const trigger = options.trigger?.current || el;

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger,
          start: options.start || 'top 85%',
          end: options.end || 'top 20%',
          scrub: options.scrub ?? false,
          markers: options.markers,
          toggleActions: options.toggleActions || 'play none none reverse',
        },
      })
      .from(el, options.from || { opacity: 0, y: 60 })
      .to(el, options.to || {});

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

// For stagger animations on multiple children
export function useStaggerAnimation<T extends HTMLElement>(
  childrenSelector: string,
  options: {
    from?: gsap.TweenVars;
    stagger?: number;
    start?: string;
  } = {},
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const children = el.querySelectorAll(childrenSelector);
    if (!children.length) return;

    const tl = gsap
      .timeline({
        scrollTrigger: {
          trigger: el,
          start: options.start || 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
      .from(children, {
        opacity: 0,
        y: 40,
        stagger: options.stagger || 0.1,
        duration: 0.8,
        ease: 'power3.out',
        ...options.from,
      });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

// Parallax effect
export function useParallax<T extends HTMLElement>(
  speed: number = 0.5,
  deps: unknown[] = [],
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.to(el, {
      y: () => (el.offsetHeight * speed),
      ease: 'none',
      scrollTrigger: {
        trigger: el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}
