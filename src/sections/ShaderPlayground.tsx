import { useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Code, Beaker } from 'lucide-react';

/* ---- Shader Mesh ---- */
function ShaderMesh() {
  const mesh = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
    }),
    [],
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  useEffect(() => {
    const handleResize = () => {
      uniforms.uResolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [uniforms]);

  return (
    <mesh ref={mesh} scale={2}>
      <planeGeometry args={[1.5, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          uniform vec2 uResolution;
          varying vec2 vUv;

          void main() {
            vec2 uv = vUv;
            vec3 color1 = vec3(0.0, 0.953, 1.0);  // cyan
            vec3 color2 = vec3(1.0, 0.0, 1.0);    // magenta
            vec3 color3 = vec3(0.545, 0.0, 0.965); // purple

            float wave = sin(uv.x * 4.0 + uTime * 0.5) * 0.2 + sin(uv.y * 6.0 + uTime * 0.3) * 0.2;
            float mixFactor = sin(uv.x * 3.0 + uv.y * 2.0 + uTime * 0.4) * 0.5 + 0.5;

            vec3 color = mix(color1, color2, mixFactor);
            color = mix(color, color3, sin(uv.x * 2.0 + uTime * 0.2) * 0.5 + 0.5);

            // Grid lines
            float gridX = abs(sin(uv.x * 20.0 + uTime * 0.1));
            float gridY = abs(sin(uv.y * 20.0 + uTime * 0.1));
            float grid = min(gridX, gridY);
            color += vec3(0.1) * (1.0 - smoothstep(0.0, 0.05, grid));

            // Pulse
            float pulse = sin(length(uv - 0.5) * 10.0 - uTime * 1.5) * 0.5 + 0.5;
            color += vec3(pulse * 0.1);

            gl_FragColor = vec4(color, 0.8);
          }
        `}
        transparent
      />
    </mesh>
  );
}

/* ---- Particle Field ---- */
function ShaderParticles() {
  const points = useRef<THREE.Points>(null);
  const count = 500;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 4;
      pos[i3 + 1] = (Math.random() - 0.5) * 3;
      pos[i3 + 2] = (Math.random() - 0.5) * 2;
      const c = new THREE.Color().setHSL(0.55 + Math.random() * 0.2, 0.8, 0.5);
      col[i3] = c.r;
      col[i3 + 1] = c.g;
      col[i3 + 2] = c.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const time = state.clock.elapsedTime;
    const pos = points.current.geometry.attributes.position;
    const array = pos.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      array[i3 + 1] += Math.sin(time * 0.5 + i * 0.01) * 0.002;
      array[i3] += Math.cos(time * 0.3 + i * 0.01) * 0.002;
    }
    pos.needsUpdate = true;
    points.current.rotation.y = time * 0.03;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors transparent opacity={0.6} blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ---- Lab Scene ---- */
function LabScene() {
  return (
    <>
      <ShaderMesh />
      <ShaderParticles />
    </>
  );
}

/* ---- Main Export ---- */
export default function ShaderPlayground() {
  return (
    <section className="section-padding relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-purple mb-4">
            <Beaker size={14} />
            Experimental Lab
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Shader Playground
          </h2>
          <p className="text-fg-secondary text-lg max-w-2xl mx-auto">
            Real-time WebGL shader experiments. Pure GPU-accelerated art — no
            compromise, no limits.
          </p>
        </motion.div>

        {/* Canvas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl overflow-hidden glass border border-glass-border"
          style={{ height: '500px' }}
        >
          <Canvas
            camera={{ position: [0, 0, 2] }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
          >
            <LabScene />
          </Canvas>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { label: 'Type', value: 'Fragment Shader (GLSL)' },
            { label: 'Performance', value: '60fps @ GPU' },
            { label: 'Technique', value: 'Ray-marched gradients' },
          ].map((item) => (
            <div key={item.label} className="glass rounded-xl p-4 text-center border border-glass-border">
              <div className="text-xs text-fg-muted mb-1">{item.label}</div>
              <div className="text-sm font-mono text-accent-cyan">{item.value}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
