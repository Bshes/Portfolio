import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

/* ---- Particle Field (Neural Network Background) ---- */
function ParticleField({ count = 3000, mouse }: { count?: number; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const mesh = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    const color = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2 + Math.random() * 4;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      const t = Math.random();
      color.setHSL(0.55 + t * 0.15, 0.8, 0.5 + t * 0.3);
      col[i3] = color.r;
      col[i3 + 1] = color.g;
      col[i3 + 2] = color.b;

      siz[i] = 0.02 + Math.random() * 0.06;
    }
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
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    const positions = mesh.current.geometry.attributes.position;
    const array = positions.array as Float32Array;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const x = array[i3];
      const y = array[i3 + 1];
      const z = array[i3 + 2];
      const dist = Math.sqrt(x * x + y * y + z * z);

      // Gentle wave motion
      const wave = Math.sin(time * 0.15 + i * 0.01) * 0.03;
      const newDist = dist + wave;
      const ratio = newDist / dist;

      const speed = 0.05 + Math.sin(i * 0.01) * 0.03;
      const rotY = time * speed * 0.1;

      const cosR = Math.cos(rotY);
      const sinR = Math.sin(rotY);
      const xRot = x * cosR - z * sinR;
      const zRot = x * sinR + z * cosR;

      array[i3] = xRot * ratio;
      array[i3 + 1] = y * ratio + Math.sin(time * 0.1 + i * 0.005) * 0.05;
      array[i3 + 2] = zRot * ratio;
    }
    positions.needsUpdate = true;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        vertexColors
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---- Connection Lines ---- */
function Connections({ count = 80, mouse }: { count?: number; mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const lineRef = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => {
    const pos: number[] = [];
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 3;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos.push(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
      );
      const radius2 = 2 + Math.random() * 3;
      const theta2 = Math.random() * Math.PI * 2;
      const phi2 = Math.acos(2 * Math.random() - 1);
      pos.push(
        radius2 * Math.sin(phi2) * Math.cos(theta2),
        radius2 * Math.sin(phi2) * Math.sin(theta2),
        radius2 * Math.cos(phi2),
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
    if (!lineRef.current) return;
    lineRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    lineRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
  });

  return (
    <lineSegments ref={lineRef} geometry={geometry}>
      <lineBasicMaterial
        color="#00f3ff"
        transparent
        opacity={0.15}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
}

/* ---- Floating Glow Orbs ---- */
function GlowOrbs() {
  const group = useRef<THREE.Group>(null);

  const orbs = useMemo(() => {
    return Array.from({ length: 5 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4,
        (Math.random() - 0.5) * 4 - 2,
      ] as [number, number, number],
      color: i % 2 === 0 ? '#00f3ff' : '#8b5cf6',
      scale: 0.3 + Math.random() * 0.5,
      speed: 0.2 + Math.random() * 0.3,
    }));
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const time = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      const orb = orbs[i];
      child.position.y += Math.sin(time * orb.speed + i) * 0.002;
      child.position.x += Math.cos(time * orb.speed * 0.7 + i * 0.5) * 0.001;
    });
  });

  return (
    <group ref={group}>
      {orbs.map((orb, i) => (
        <mesh key={i} position={orb.position}>
          <sphereGeometry args={[orb.scale, 16, 16]} />
          <meshBasicMaterial
            color={orb.color}
            transparent
            opacity={0.06}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---- Scene Composer ---- */
function Scene({ mouse }: { mouse: React.MutableRefObject<{ x: number; y: number }> }) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useFrame(() => {
    if (!cameraRef.current) return;
    cameraRef.current.position.x += (mouse.current.x * 0.5 - cameraRef.current.position.x) * 0.02;
    cameraRef.current.position.y += (-mouse.current.y * 0.5 - cameraRef.current.position.y) * 0.02;
    cameraRef.current.lookAt(0, 0, 0);
  });

  return (
    <>
      <perspectiveCamera ref={cameraRef} position={[0, 0, 5]} fov={60} />
      <ParticleField count={2500} mouse={mouse} />
      <Connections count={60} mouse={mouse} />
      <GlowOrbs />
    </>
  );
}

/* ---- Main Export ---- */
export default function NeuralNetwork() {
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0">
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
        <Scene mouse={mouse} />
      </Canvas>
    </div>
  );
}
