export interface CaseStudy {
  id: string;
  title: string;
  client: string;
  category: string;
  description: string;
  challenge: string;
  solution: string;
  results: { metric: string; value: string }[];
  tags: string[];
  gradient: string;
  link?: string;
  year: number;
}

export const caseStudies: CaseStudy[] = [
  {
    id: 'neural-labs',
    title: 'Neural Labs Rebrand',
    client: 'Neural Labs AI',
    category: 'Brand Identity & Web',
    description: 'A complete digital transformation for an AI research startup, combining WebGL storytelling with a sophisticated brand system.',
    challenge: 'Neural Labs had groundbreaking AI technology but their website felt like a generic SaaS template. They needed a digital presence that matched their innovative spirit — something that communicated "bleeding-edge AI" the moment visitors landed.',
    solution: 'We built a custom WebGL-powered experience with interactive 3D data visualizations showing their neural network architecture, kinetic typography that responds to scroll, and a dark-mode-first design system with cyan/magenta gradients that reflects their cutting-edge research. The hero features a real-time particle simulation representing their AI model in action.',
    results: [
      { metric: 'Traffic Increase', value: '340%' },
      { metric: 'Avg. Session', value: '4.2 min' },
      { metric: 'Conversion Rate', value: '6.8%' },
    ],
    tags: ['WebGL', 'Brand Identity', '3D Animation', 'UI/UX'],
    gradient: 'from-cyan-500 to-blue-600',
    link: 'https://neurallabs.ai',
    year: 2025,
  },
  {
    id: 'quantum-commerce',
    title: 'Quantum Commerce',
    client: 'Quantum Retail',
    category: 'E-Commerce Experience',
    description: 'An immersive shopping experience with AI-powered product recommendations and 3D product visualization.',
    challenge: 'Quantum Retail needed to differentiate in a crowded e-commerce space. Standard Shopify templates were not cutting it — they needed a premium, experience-driven approach that would justify higher price points and build brand loyalty.',
    solution: 'We designed a custom headless e-commerce platform with Three.js 3D product viewers (spin, zoom, and configure in real-time), AI-powered size recommendations using body measurement prediction, and a gamified loyalty system with progress bars and achievement unlocks that increased average order value by 67%.',
    results: [
      { metric: 'Avg. Order Value', value: '+67%' },
      { metric: 'Conversion', value: '+42%' },
      { metric: 'Bounce Rate', value: '-28%' },
    ],
    tags: ['E-Commerce', '3D Viewer', 'AI Recommendations', 'UX Design'],
    gradient: 'from-purple-500 to-pink-600',
    link: 'https://quantumretail.io',
    year: 2025,
  },
  {
    id: 'axon-finance',
    title: 'Axon Finance Platform',
    client: 'Axon Financial',
    category: 'Fintech Dashboard',
    description: 'A real-time financial analytics dashboard with AI-driven insights and glassmorphism design language.',
    challenge: 'Axon Financial had complex data that needed to be accessible and beautiful. Their legacy dashboard was confusing and had high churn among new users.',
    solution: 'We created a glassmorphism-based dashboard with real-time WebGL data visualizations, AI-powered anomaly detection, and an intuitive onboarding flow.',
    results: [
      { metric: 'User Retention', value: '+89%' },
      { metric: 'Task Completion', value: '+73%' },
      { metric: 'NPS Score', value: '72' },
    ],
    tags: ['Fintech', 'Dashboard', 'Data Viz', 'Glassmorphism'],
    gradient: 'from-emerald-500 to-teal-600',
    link: 'https://axonfinancial.io',
    year: 2024,
  },
  {
    id: 'pulse-health',
    title: 'Pulse Health Portal',
    client: 'Pulse Healthcare',
    category: 'Healthcare Platform',
    description: 'A patient-centric healthcare portal with AI-assisted diagnostics and compassionate UX design.',
    challenge: 'Pulse Healthcare needed a patient portal that was both technically sophisticated and emotionally reassuring — a rare combination in healthcare UX. Their existing solution had a 40% abandonment rate during onboarding.',
    solution: 'We designed a calm, accessible interface with AI-assisted symptom checking (NLP-powered triage), secure video consultation integration using WebRTC, and a personalized health timeline that surfaces relevant insights. Every interaction was user-tested with actual patients to ensure it felt safe and intuitive.',
    results: [
      { metric: 'Patient Engagement', value: '+156%' },
      { metric: 'Appointment No-shows', value: '-64%' },
      { metric: 'Satisfaction', value: '4.8/5.0' },
    ],
    tags: ['Healthcare', 'AI Diagnostics', 'UX Design', 'Accessibility'],
    gradient: 'from-rose-500 to-orange-500',
    link: 'https://pulsehealth.io',
    year: 2024,
  },
];
