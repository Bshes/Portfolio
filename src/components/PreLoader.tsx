import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreLoaderProps {
  /** Minimum loading time in ms (default: 2500) */
  minDuration?: number;
  /** Called when preloader finishes */
  onFinish?: () => void;
}

/**
 * Creative pre-loader with a canvas-drawn neural "S" logo and progress rings.
 * Auto-dismisses after assets are ready or minDuration elapses.
 */
export default function PreLoader({ minDuration = 2500, onFinish }: PreLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'exiting'>('loading');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.clientWidth * window.devicePixelRatio;
      canvas.height = canvas.clientHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();
    window.addEventListener('resize', resize);

    // Canvas particle system for the neural "S"
    const particles: {
      x: number; y: number;
      vx: number; vy: number;
      size: number;
      hue: number;
      life: number;
      maxLife: number;
    }[] = [];

    const centerX = canvas.clientWidth / 2;
    const centerY = canvas.clientHeight / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.35;

    let frame = 0;
    let animationId: number;

    const animate = () => {
      frame++;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;

      // Fade background
      ctx.fillStyle = 'rgba(5, 5, 8, 0.15)';
      ctx.fillRect(0, 0, w, h);

      // Generate particles along the "S" curve
      if (particles.length < 120 && frame % 2 === 0) {
        const t = Math.random() * Math.PI * 2;
        // Parametric "S" curve
        const sx = Math.sin(t * 1.5) * maxRadius;
        const sy = Math.sin(t * 2 + Math.PI * 0.5) * maxRadius * 0.6;

        particles.push({
          x: centerX + sx,
          y: centerY + sy,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          size: 1 + Math.random() * 3,
          hue: 185 + Math.random() * 50, // cyan range
          life: 0,
          maxLife: 60 + Math.random() * 40,
        });
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        p.size *= 0.995;

        if (p.life > p.maxLife || p.size < 0.1) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${alpha * 0.8})`;
        ctx.fill();

        // Connection lines to nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `hsla(${p.hue}, 80%, 60%, ${alpha * 0.15 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update progress
      setProgress((prev) => Math.min(prev + 0.005, 1));

      animationId = requestAnimationFrame(animate);
    };

    // Start dark background
    ctx.fillStyle = '#050508';
    ctx.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    animate();

    // Auto-dismiss after minDuration
    const timer = setTimeout(async () => {
      setPhase('exiting');
      await new Promise((r) => setTimeout(r, 600));
      setIsVisible(false);
      cancelAnimationFrame(animationId);
      onFinish?.();
    }, minDuration);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [minDuration, onFinish]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[200] bg-deep flex flex-col items-center justify-center"
        >
          {/* Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: 'block' }}
          />

          {/* Logo + brand */}
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center text-2xl font-bold font-display text-deep mb-4 shadow-lg shadow-accent-cyan/20">
              S
            </div>
            <h1 className="font-display text-xl font-semibold text-fg-primary tracking-tight">
              Saino
            </h1>
            <p className="text-xs text-fg-muted mt-1">AI Web Design Studio</p>
          </div>

          {/* Progress ring */}
          <div className="relative z-10 mt-10 w-10 h-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth="2"
              />
              <motion.circle
                cx="20" cy="20" r="16"
                fill="none"
                stroke="url(#preloader-gradient)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray={`${progress * 100} 100`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="preloader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f3ff" />
                  <stop offset="100%" stopColor="#ff00ff" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Status text */}
          <motion.p
            className="relative z-10 text-xs text-fg-muted mt-4 font-mono"
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            {phase === 'loading' ? 'Initializing neural engine...' : 'Ready'}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
