import { useRef, useEffect, useCallback } from 'react';
import { FluidSimulation } from 'three-fluid-fx';
import * as THREE from 'three';

export interface FluidConfig {
  simResolution?: number;
  dyeResolution?: number;
  pressureIterations?: number;
  densityDissipation?: number;
  velocityDissipation?: number;
  curlStrength?: number;
  autoDemo?: boolean;
  colors?: [number, number, number][];
  splatRadius?: number;
  splatForce?: number;
}

const DEFAULT_COLORS: [number, number, number][] = [
  [0, 0.953, 1],
  [1, 0, 1],
  [0.545, 0, 0.965],
  [1, 0.843, 0],
];

function lerpColor(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}

export function useFluidSimulation(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  config: FluidConfig = {},
) {
  const simRef = useRef<FluidSimulation | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);
  const mountedRef = useRef(true);
  const pointerRef = useRef({ x: -1, y: -1, px: -1, py: -1, active: false });
  const colorRef = useRef(0);
  const idleRef = useRef(0);

  const {
    simResolution = 256,
    dyeResolution = 1024,
    pressureIterations = 16,
    densityDissipation = 0.91,
    velocityDissipation = 0.98,
    curlStrength = 8,
    autoDemo = true,
    colors = DEFAULT_COLORS,
    splatRadius = 0.004,
    splatForce = 8,
  } = config;

  // Convert normalized coords to fluid sim coords
  const normToSim = useCallback((x: number, y: number) => {
    return { x: x, y: 1 - y };
  }, []);

  // Animation loop
  const animate = useCallback(() => {
    if (!mountedRef.current) return;
    const sim = simRef.current;
    const renderer = rendererRef.current;
    if (!sim || !renderer) return;

    const now = performance.now();
    const dt = Math.min((now - lastTimeRef.current) / 1000, 0.05);
    lastTimeRef.current = now;

    // Auto-demo: create splats when idle
    if (autoDemo && !pointerRef.current.active) {
      idleRef.current += dt;
      if (idleRef.current > 2) {
        const t = now * 0.0004;
        const cx = 0.5 + Math.sin(t * 0.7) * 0.25;
        const cy = 0.5 + Math.cos(t * 0.5) * 0.25;
        const dx = Math.cos(t * 0.7) * 0.3;
        const dy = Math.sin(t * 0.5) * 0.3;
        const ci = Math.floor(now * 0.001) % colors.length;
        sim.addSplat(cx, cy, dx, dy, { radius: 0.006, color: colors[ci] });
      }
    } else {
      idleRef.current = 0;
    }

    // Handle active pointer — add splats along the trail
    const p = pointerRef.current;
    if (p.active && p.x >= 0 && p.y >= 0 && p.px >= 0 && p.py >= 0) {
      const dx = (p.x - p.px) * 10;
      const dy = (p.y - p.py) * 10;
      const speed = Math.sqrt(dx * dx + dy * dy);

      if (speed > 0.3) {
        const nc = normToSim(p.x, p.y);
        const colorIdx = colorRef.current % colors.length;
        const nextIdx = (colorIdx + 1) % colors.length;
        const mix = Math.sin(now * 0.003) * 0.5 + 0.5;
        const color = lerpColor(colors[colorIdx], colors[nextIdx], mix);

        sim.addSplat(nc.x, nc.y, dx * 0.003, dy * 0.003, {
          radius: Math.min(splatRadius * (1 + speed * 0.02), 0.05),
          color,
        });
      }
      p.px = p.x;
      p.py = p.y;
    }

    sim.step(dt);
    renderer.render(sim.scene, sim.camera);
    rafRef.current = requestAnimationFrame(animate);
  }, [autoDemo, colors, normToSim, splatRadius]);

  // Pointer event handlers
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      const p = pointerRef.current;
      const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
      if (!rect) return;
      p.x = (e.clientX - rect.left) / rect.width;
      p.y = (e.clientY - rect.top) / rect.height;
      if (!p.active) {
        p.px = p.x;
        p.py = p.y;
      }
      p.active = true;
    };

    const onPointerDown = (e: PointerEvent) => {
      colorRef.current = (colorRef.current + 1) % colors.length;
      const p = pointerRef.current;
      const rect = canvasRef.current?.parentElement?.getBoundingClientRect();
      if (!rect) return;
      p.x = (e.clientX - rect.left) / rect.width;
      p.y = (e.clientY - rect.top) / rect.height;
      p.px = p.x;
      p.py = p.y;
      p.active = true;
    };

    const onPointerUp = () => {
      pointerRef.current.active = false;
    };

    const onPointerLeave = () => {
      pointerRef.current.active = false;
    };

    // Attach to document so events pass through pointer-events: none overlay
    document.addEventListener('pointermove', onPointerMove, { passive: true });
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('pointerup', onPointerUp, { passive: true });
    document.addEventListener('pointerleave', onPointerLeave, { passive: true });

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, [canvasRef, colors.length]);

  // Initialize simulation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    mountedRef.current = true;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    rendererRef.current = renderer;

    const sim = new FluidSimulation(renderer, {
      simResolution,
      dyeResolution,
      pressureIterations,
      densityDissipation,
      velocityDissipation,
      curlStrength,
      splatRadius: splatRadius * 100,
      splatForce,
    });
    sim.enableDye = true;
    simRef.current = sim;

    // Initial resize
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h, false);
        sim.resize(w, h);
      }
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas.parentElement || canvas);

    // Start animation
    idleRef.current = 0;
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      sim.dispose();
      renderer.dispose();
      simRef.current = null;
      rendererRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return simRef;
}

interface FluidOverlayProps extends FluidConfig {
  className?: string;
}

export default function FluidOverlay({ className = '', ...config }: FluidOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useFluidSimulation(canvasRef, config);

  return (
    <div
      className={`fluid-overlay fixed inset-0 z-[100] pointer-events-none select-none ${className}`}
      style={{ mixBlendMode: 'difference' as any }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
