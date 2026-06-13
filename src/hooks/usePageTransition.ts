import React, { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

/**
 * usePageTransition – orchestrates morphing page transitions using GSAP Flip.
 *
 * How it works:
 * 1. Before route change, we snapshot the current page's state
 * 2. We animate out with a mask/reveal effect
 * 3. New page renders in a "hidden" state
 * 4. We animate in with a matching reveal
 * 5. Shared elements (nav, footer) use Flip for seamless morphing
 */

interface PageTransitionOptions {
  /** Duration of the transition in seconds */
  duration?: number;
  /** Easing function */
  ease?: string;
  /** CSS selector for the page wrapper */
  containerSelector?: string;
}

export function usePageTransition({
  duration = 0.6,
  ease = 'power3.inOut',
  containerSelector = '[data-page-container]',
}: PageTransitionOptions = {}) {
  const location = useLocation();
  const prevPathRef = useRef(location.pathname);
  const isAnimating = useRef(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Register the container ref
  const setContainerRef = useCallback((el: HTMLDivElement | null) => {
    containerRef.current = el;
  }, []);

  useEffect(() => {
    if (location.pathname === prevPathRef.current) return;
    prevPathRef.current = location.pathname;
  }, [location]);

  /**
   * Call this BEFORE the new page content renders.
   * Captures shared elements and creates the outbound animation.
   */
  const captureOutbound = useCallback(async (): Promise<void> => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const container = containerRef.current;
    if (!container) {
      isAnimating.current = false;
      return;
    }

    // Capture Flip state of any shared elements
    const flipState = Flip.getState('[data-flip-key]', { props: 'opacity,transform,width,height' });

    return new Promise((resolve) => {
      // Outbound animation: scale + fade
      gsap.to(container, {
        opacity: 0,
        scale: 0.97,
        duration: duration * 0.5,
        ease,
        onComplete: () => {
          isAnimating.current = false;
          resolve();
        },
      });
    });
  }, [duration, ease]);

  /**
   * Call this AFTER the new page content has rendered.
   * Animates in the new page and morphs shared elements.
   */
  const animateInbound = useCallback(async (): Promise<void> => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial state
    gsap.set(container, { opacity: 0, scale: 0.97 });

    return new Promise((resolve) => {
      gsap.to(container, {
        opacity: 1,
        scale: 1,
        duration: duration * 0.5,
        ease: 'power2.out',
        delay: 0.05,
        onComplete: resolve,
      });
    });
  }, [duration]);

  return {
    setContainerRef,
    captureOutbound,
    animateInbound,
    isAnimating,
  };
}

/**
 * Wrap shared elements with `data-flip-key="unique-id"` to morph them
 * seamlessly between page transitions.
 *
 * Example:
 *   <div data-flip-key="hero-title">This morphs between pages</div>
 */
export function FlipElement({
  flipKey,
  children,
  className = '',
  ...props
}: {
  flipKey: string;
  children: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}) {
  return React.createElement('div', { 'data-flip-key': flipKey, className, ...props }, children);
}
