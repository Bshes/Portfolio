import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { createNoise2D, createNoise3D } from 'simplex-noise';

/* ---- Custom Shader Material for the Neural Sculpture ---- */
const vertexShader = `
  uniform float uTime;
  uniform float uMorph;
  uniform vec2 uMouse;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  // Simplex noise GLSL (simplified 3D noise)
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + 0.1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
          mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
      mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
          mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z
    );
  }

  void main() {
    vec3 pos = position;
    float n = noise(pos * 2.0 + uTime * 0.15);
    float n2 = noise(pos * 3.0 + uTime * 0.1 + 10.0);

    // Displacement based on noise + mouse influence
    float mouseInfluence = sin(pos.x * 2.0 + uMouse.x * 3.0) * cos(pos.y * 2.0 + uMouse.y * 3.0) * 0.1;
    float displacement = (n - 0.5) * 0.4 + (n2 - 0.5) * 0.2 + mouseInfluence * uMorph;
    vDisplacement = displacement;

    vec3 newPos = pos + normal * displacement;
    vNormal = normalize(normalMatrix * normal);
    vPosition = (modelViewMatrix * vec4(newPos, 1.0)).xyz;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying float vDisplacement;

  void main() {
    // Fresnel effect
    vec3 viewDir = normalize(-vPosition);
    float fresnel = 1.0 - max(dot(viewDir, normalize(vNormal)), 0.0);
    fresnel = pow(fresnel, 3.0);

    // Color mixing based on displacement and fresnel
    float mix1 = sin(vDisplacement * 5.0 + uTime * 0.3) * 0.5 + 0.5;
    float mix2 = fresnel;

    vec3 color = mix(uColor1, uColor2, mix1);
    color = mix(color, uColor3, mix2 * 0.5);

    // Glow on edges
    float glow = fresnel * 0.6 + 0.2;
    color += vec3(0.2, 0.5, 0.8) * glow * 0.3;

    // Grid-like pulse
    float pulse = sin(vPosition.x * 8.0 + vPosition.y * 6.0 + uTime * 0.5) * 0.5 + 0.5;
    color += vec3(0.0, 0.1, 0.15) * pulse;

    gl_FragColor = vec4(color, 0.9);
  }
`;

/* ---- Wireframe Overlay Shader ---- */
const wireVertexShader = `
  uniform float uTime;
  varying vec3 vPos;
  void main() {
    vec3 pos = position;
    float n = sin(pos.x * 3.0 + pos.y * 2.0 + pos.z * 4.0 + uTime * 0.2) * 0.1;
    pos += normal * n;
    vPos = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const wireFragmentShader = `
  uniform vec3 uColor;
  varying vec3 vPos;
  void main() {
    float alpha = sin(vPos.x * 10.0 + vPos.y * 8.0 + vPos.z * 6.0) * 0.3 + 0.4;
    gl_FragColor = vec4(uColor, alpha * 0.5);
  }
`;

/* ---- The 3D Sculpture Component ---- */
function NeuralSculpture({ mouse }: { mouse: React.RefObject<{ x: number; y: number }> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMorph: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uColor1: { value: new THREE.Color('#00f3ff') },
      uColor2: { value: new THREE.Color('#8b5cf6') },
      uColor3: { value: new THREE.Color('#ff00ff') },
    }),
    [],
  );

  const wireUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#00f3ff') },
    }),
    [],
  );

  // Geometry: high-detail icosahedron with spherical mapping for organic look
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 4);
    // Spherify vertices
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);
      const len = Math.sqrt(x * x + y * y + z * z);
      pos.setXYZ(i, x / len, y / len, z / len);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  const wireGeo = useMemo(() => {
    return new THREE.IcosahedronGeometry(1.05, 2);
  }, []);

  const { viewport } = useThree();

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    uniforms.uTime.value = time;
    wireUniforms.uTime.value = time;

    // Mouse interaction
    uniforms.uMouse.value.x = mouse.current.x;
    uniforms.uMouse.value.y = mouse.current.y;

    // Morph intensity based on mouse speed
    const speed = Math.sqrt(
      Math.pow(mouse.current.x - (mouse.current.px || 0), 2) +
      Math.pow(mouse.current.y - (mouse.current.py || 0), 2),
    );
    uniforms.uMorph.value += (Math.min(speed * 2, 1) - uniforms.uMorph.value) * 0.05;
    mouse.current.px = mouse.current.x;
    mouse.current.py = mouse.current.y;

    // Group rotation follows mouse
    if (groupRef.current) {
      groupRef.current.rotation.x += (mouse.current.y * 0.3 - groupRef.current.rotation.x) * 0.02;
      groupRef.current.rotation.y += (mouse.current.x * 0.5 - groupRef.current.rotation.y) * 0.02;
      // Constant slow rotation
      groupRef.current.rotation.z += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main sculpture */}
      <mesh ref={meshRef} geometry={geometry}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe overlay */}
      <mesh ref={wireRef} geometry={wireGeo}>
        <shaderMaterial
          uniforms={wireUniforms}
          vertexShader={wireVertexShader}
          fragmentShader={wireFragmentShader}
          wireframe
          transparent
        />
      </mesh>

      {/* Glow aura (inner) */}
      <mesh>
        <icosahedronGeometry args={[1.3, 2]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.04}
          wireframe
        />
      </mesh>
    </group>
  );
}

/* ---- Scene Setup ---- */
function Scene({ mouse }: { mouse: React.RefObject<{ x: number; y: number; px: number; py: number }> }) {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[5, 3, 5]} intensity={0.5} color="#00f3ff" />
      <pointLight position={[-5, -3, -5]} intensity={0.3} color="#ff00ff" />
      <NeuralSculpture mouse={mouse} />
    </>
  );
}

/* ---- Main Export ---- */
export default function NeuralMascot({
  className = '',
  scale = 1,
}: {
  className?: string;
  scale?: number;
}) {
  const mouse = useRef({ x: 0, y: 0, px: 0, py: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className={className} style={{ width: '100%', height: '100%' }}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
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
