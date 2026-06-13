export interface ProcessStep {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  duration: string;
}

export const processSteps: ProcessStep[] = [
  {
    id: 1,
    title: 'Discovery',
    subtitle: 'Understanding your vision',
    description: 'We dive deep into your brand, your audience, and your goals. Using AI-powered analysis, we identify opportunities and define success metrics that matter.',
    icon: 'Search',
    duration: 'Week 1',
  },
  {
    id: 2,
    title: 'Architecture',
    subtitle: 'Blueprint for brilliance',
    description: 'We design the information architecture, user flows, and interaction models. Every decision is backed by data and crafted for emotional impact.',
    icon: 'Layers',
    duration: 'Week 1-2',
  },
  {
    id: 3,
    title: 'Design',
    subtitle: 'Where aesthetics meet function',
    description: 'Our designers create pixel-perfect interfaces with WebGL prototyping, kinetic typography, and glassmorphism design systems tailored to your brand.',
    icon: 'Palette',
    duration: 'Week 2-3',
  },
  {
    id: 4,
    title: 'Development',
    subtitle: 'Engineering excellence',
    description: 'We build with cutting-edge technology: Three.js for 3D, GSAP for animations, and GPU-accelerated shaders. Performance and accessibility are non-negotiable.',
    icon: 'Code',
    duration: 'Week 3-4',
  },
  {
    id: 5,
    title: 'Launch',
    subtitle: 'Go time, perfected',
    description: 'We optimize for Lighthouse 100, configure your analytics, set up edge deployment, and monitor real-user performance. You get a launch that scales.',
    icon: 'Rocket',
    duration: 'Week 4',
  },
  {
    id: 6,
    title: 'Evolve',
    subtitle: 'Continuous growth',
    description: 'Post-launch, we analyze user behavior, run A/B tests, and iterate. Your digital presence never stops improving — just like your business.',
    icon: 'RefreshCw',
    duration: 'Ongoing',
  },
];
