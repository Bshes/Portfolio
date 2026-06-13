import { useEffect, useRef, useCallback } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface CustomCursorProps {
  /** Magnetic attraction strength (0-1) for CTA elements */
  magneticStrength?: number;
}

/**
 * Custom cursor that replaces the default with a styled ring + dot.
 * Expands on hover over interactive elements and has a magnetic pull.
 */
export default function CustomCursor({ magneticStrength = 0.4 }: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const posRef = useRef({ x: -100, y: -100, px: -100, py: -100 });
  const rafRef = useRef<number>(0);

  // Track pointer position
  const handlePointerMove = useCallback((e: PointerEvent) => {
    posRef.current = {
      x: e.clientX,
      y: e.clientY,
      px: posRef.current.x,
      py: posRef.current.y,
    };
  }, []);

  // Handle interactive element hovers
  const handleOver = useCallback((e: Event) => {
    const target = e.currentTarget as HTMLElement;
    if (!cursorRef.current || !ringRef.current) return;

    const rect = target.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    cursorRef.current.style.width = '40px';
    cursorRef.current.style.height = '40px';
    cursorRef.current.style.transform = `translate(${cx - 20}px, ${cy - 20}px)`;

    ringRef.current.style.width = '20px';
    ringRef.current.style.height = '20px';
    ringRef.current.style.borderColor = 'var(--color-accent-cyan)';
  }, []);

  const handleOut = useCallback(() => {
    if (!cursorRef.current || !ringRef.current) return;
    cursorRef.current.style.width = '20px';
    cursorRef.current.style.height = '20px';
    ringRef.current.style.width = '10px';
    ringRef.current.style.height = '10px';
    ringRef.current.style.borderColor = 'rgba(0, 243, 255, 0.3)';
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    // Animation loop — smoothly follow cursor
    const animate = () => {
      const p = posRef.current;
      const cursor = cursorRef.current;
      if (!cursor) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      // Smooth interpolation
      const dx = p.x - p.px;
      const dy = p.y - p.py;
      const speed = Math.sqrt(dx * dx + dy * dy);

      // Ring effect: expand slightly on fast movement
      if (ringRef.current) {
        const scale = 1 + Math.min(speed * 0.03, 0.5);
        ringRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
      }

      cursor.style.left = `${p.x}px`;
      cursor.style.top = `${p.y}px`;

      rafRef.current = requestAnimationFrame(animate);
    };

    document.addEventListener('pointermove', handlePointerMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reducedMotion, handlePointerMove]);

  // Hook up hover listeners for interactive elements
  useEffect(() => {
    if (reducedMotion) return;

    const selectors = 'a, button, [role="button"], input, textarea, select, .cursor-hover';
    const targets = document.querySelectorAll<HTMLElement>(selectors);

    targets.forEach((el) => {
      el.addEventListener('mouseenter', handleOver);
      el.addEventListener('mouseleave', handleOut);
    });

    // Observe for dynamically added elements
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>(selectors).forEach((el) => {
        if (!el.dataset.cursorAttached) {
          el.dataset.cursorAttached = 'true';
          el.addEventListener('mouseenter', handleOver);
          el.addEventListener('mouseleave', handleOut);
        }
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      targets.forEach((el) => {
        el.removeEventListener('mouseenter', handleOver);
        el.removeEventListener('mouseleave', handleOut);
      });
      observer.disconnect();
    };
  }, [reducedMotion, handleOver, handleOut]);

  // Cursor styles are applied via the CSS classes
  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[150] pointer-events-none transition-[width,height] duration-200 ease-out-expo"
        style={{
          width: 20,
          height: 20,
          marginLeft: -10,
          marginTop: -10,
          willChange: 'transform',
        }}
      >
        {/* Ring */}
        <div
          ref={ringRef}
          className="absolute inset-0 rounded-full border transition-[width,height,border-color] duration-300"
          style={{
            width: 10,
            height: 10,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderColor: 'rgba(0, 243, 255, 0.3)',
            borderWidth: 1.5,
          }}
        />
      </div>

      {/* Hide default cursor */}
      <style>{`
        html {
          cursor: none !important;
        }
        html * {
          cursor: none !important;
        }
        .reduce-motion,
        .reduce-motion * {
          cursor: auto !important;
        }
        @media (hover: none) and (pointer: coarse) {
          html { cursor: auto !important; }
          html * { cursor: auto !important; }
        }
      `}</style>
    </>
  );
}

/**
 * Class name to add to any element that should trigger cursor hover effects.
 * Usage: <div className="cursor-hover" />
 */
export const CURSOR_HOVER_CLASS = 'cursor-hover';
