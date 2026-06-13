export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
}

export const servicePackages: ServicePackage[] = [
  {
    id: 'neural-spark',
    name: 'Neural Spark',
    tagline: 'For bold beginnings',
    price: 2499,
    period: 'one-time',
    description: 'A stunning AI-powered landing page that makes your first impression unforgettable. Perfect for MVPs, startups, and product launches.',
    features: [
      '1-page immersive AI landing page',
      'WebGL hero animation with 3D elements',
      'GSAP scroll-driven micro-interactions',
      'Responsive, mobile-first design',
      'SEO-optimized structure with meta tags',
      'CMS-ready content management',
      'Google Analytics & conversion tracking',
      '2 rounds of revisions',
      '1-month hosting support',
      'Performance optimization (90+ Lighthouse)',
    ],
  },
  {
    id: 'synapse-system',
    name: 'Synapse System',
    tagline: 'For growing brands',
    price: 4999,
    period: 'one-time',
    description: 'A complete multi-page digital presence with custom 3D, AI interactivity, and conversion-optimized design systems.',
    features: [
      'Up to 5 custom-designed pages',
      'Custom 3D elements & WebGL integration',
      'AI-powered chat widget (offline-ready)',
      'Advanced GSAP animation system',
      'Bento grid layout architecture',
      'Dark mode design system',
      'Analytics & conversion tracking',
      'CRM integration setup',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'cortex-complete',
    name: 'Cortex Complete',
    tagline: 'For market leaders',
    price: 9999,
    period: 'one-time',
    description: 'A full digital ecosystem with custom WebGL shaders, AI workflow integration, and 3 months of ongoing optimization.',
    features: [
      'Full digital ecosystem (up to 10 pages)',
      'Custom WebGL shaders & GPU-accelerated graphics',
      'AI workflow automation integration',
      'Custom 3D product/configurator viewer',
      'Advanced scroll-driven storytelling',
      'Brand identity expansion',
      '3-month performance retainer',
      'Priority 24/7 support',
    ],
    badge: 'Enterprise',
  },
];

export interface Addon {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const addons: Addon[] = [
  { id: 'shader', name: 'Custom WebGL Shader', price: 800, description: 'Unique GPU-accelerated visual effect for your brand' },
  { id: 'ai-agent', name: 'AI Agent Integration', price: 1500, description: 'Intelligent automation for your business workflows' },
  { id: '3d-viewer', name: '3D Product Viewer', price: 2000, description: 'Interactive 3D product visualization' },
  { id: 'maintenance', name: 'Monthly Maintenance', price: 299, description: 'Security updates, backups, and performance monitoring' },
];
