import { useRef, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise3D } from 'simplex-noise';

const noise3D = createNoise3D();

/* ---- Particle System Component ---- */
function ParticleCloud({
  mouse,
  scroll,
  count = 1200,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
  count?: number;
}) {
  const points = useRef<THREE.Points>(null);
  const velocityRef = useRef<Float32Array>(null);
  const phaseRef = useRef(0);

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      // Distribute in a spherical cloud
      const radius = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      vel[i3] = (Math.random() - 0.5) * 0.01;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.01;

      const hue = 0.55 + Math.random() * 0.15; // cyan range
      const c = new THREE.Color().setHSL(hue, 0.8, 0.4 + Math.random() * 0.4);
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;

      siz[i] = 0.02 + Math.random() * 0.08;
    }

    velocityRef.current = vel;
    return [pos, col, siz];
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, colors, sizes]);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    const vel = velocityRef.current!;
    const m = mouse.current;
    const scrollVal = scroll.current;

    phaseRef.current += 0.005;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Noise-based organic motion
      const nx = noise3D(array[i3] * 0.3, array[i3 + 1] * 0.3, time * 0.08 + i * 0.001);
      const ny = noise3D(array[i3] * 0.3 + 50, array[i3 + 2] * 0.3, time * 0.08 + i * 0.002);
      const nz = noise3D(array[i3 + 1] * 0.3 + 100, array[i3] * 0.3, time * 0.08 + i * 0.003);

      // Mouse influence
      const dx = array[i3] - m.x * 2;
      const dy = array[i3 + 1] - m.y * 2;
      const d = Math.sqrt(dx * dx + dy * dy);
      const mouseForce = Math.max(0, 1 - d * 0.1) * 0.02;

      // Scroll influence
      const scrollPush = scrollVal * 0.002;

      vel[i3] += nx * 0.002 + dx * mouseForce + scrollPush * 0.5;
      vel[i3 + 1] += ny * 0.002 + dy * mouseForce + scrollPush * 0.3;
      vel[i3 + 2] += nz * 0.002 + scrollPush * 0.1;

      // Damping
      vel[i3] *= 0.995;
      vel[i3 + 1] *= 0.995;
      vel[i3 + 2] *= 0.995;

      // Update position
      array[i3] += vel[i3];
      array[i3 + 1] += vel[i3 + 1];
      array[i3 + 2] += vel[i3 + 2];

      // Keep within bounds
      const dist = Math.sqrt(
        array[i3] * array[i3] + array[i3 + 1] * array[i3 + 1] + array[i3 + 2] * array[i3 + 2],
      );
      if (dist > 6) {
        const ratio = 5.5 / dist;
        array[i3] *= ratio;
        array[i3 + 1] *= ratio;
        array[i3 + 2] *= ratio;
      }
    }

    pos.needsUpdate = true;

    // Gentle rotation of the whole system
    if (points.current) {
      points.current.rotation.y = Math.sin(time * 0.02) * 0.1;
      points.current.rotation.x = Math.sin(time * 0.015) * 0.05;
    }
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---- Connection Lines Between Nearby Particles ---- */
function ParticleConnections({
  mouse,
  count = 200,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  count?: number;
}) {
  const linesRef = useRef<THREE.LineSegments>(null);

  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < count; i++) {
      const radius = 1.5 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
      const r2 = 1.5 + Math.random() * 3.5;
      const t2 = Math.random() * Math.PI * 2;
      const p2 = Math.acos(2 * Math.random() - 1);
      pos.push(
        r2 * Math.sin(p2) * Math.cos(t2),
        r2 * Math.sin(p2) * Math.sin(t2),
        r2 * Math.cos(p2),
      );
    }
    return new Float32Array(pos);
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [positions]);

  useFrame((state) => {
    if (!linesRef.current) return;
    linesRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    linesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.05;
  });

  return (
    <lineSegments ref={linesRef} geometry={geometry}>
      <lineBasicMaterial color="#00f3ff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
    </lineSegments>
  );
}

/* ---- Scene ---- */
function Scene({
  mouse,
  scroll,
}: {
  mouse: React.RefObject<{ x: number; y: number }>;
  scroll: React.RefObject<number>;
}) {
  return (
    <>
      <ParticleCloud mouse={mouse} scroll={scroll} count={1500} />
      <ParticleConnections mouse={mouse} count={150} />
    </>
  );
}

/* ---- Main Export ---- */
export default function GPUParticles({ className = '' }: { className?: string }) {
  const mouse = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  const handleScroll = useCallback(() => {
    scroll.current = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleMouseMove, handleScroll]);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        style={{ background: 'transparent' }}
      >
        <Scene mouse={mouse} scroll={scroll} />
      </Canvas>
    </div>
  );
}
