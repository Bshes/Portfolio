export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  content: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 't1',
    name: 'Dr. Elena Vasquez',
    role: 'CEO',
    company: 'Neural Labs AI',
    avatar: 'EL',
    content: 'Saino completely transformed our digital presence. The WebGL experience they built perfectly captures the innovative spirit of our AI research. Our Series A investors specifically mentioned the website as a key factor — it made us look like the market leader我们从第一天就应该是的样子.',
    rating: 5,
  },
  {
    id: 't2',
    name: 'Marcus Chen',
    role: 'Head of Product',
    company: 'Quantum Retail',
    avatar: 'MC',
    content: 'The 3D product viewer alone increased our conversion rate by 42% in the first month. Saino doesn\'t just design websites — they engineer growth systems. Every micro-interaction, every animation, every layout decision was backed by data and user testing.',
    rating: 5,
  },
  {
    id: 't3',
    name: 'Sarah Mitchell',
    role: 'CTO',
    company: 'Axon Financial',
    avatar: 'SM',
    content: 'Working with Saino was like having a dedicated innovation lab on retainer. The AI-powered dashboard they built processes millions of data points in real-time with WebGL visualizations that our competitors simply cannot match. Our enterprise clients are consistently impressed.',
    rating: 5,
  },
  {
    id: 't4',
    name: 'James Park',
    role: 'Founder',
    company: 'Pulse Healthcare',
    avatar: 'JP',
    content: 'Saino understood that healthcare UX needs to be both sophisticated and compassionate. They spent weeks shadowing our clinical team to truly understand patient needs. The portal they delivered reduced onboarding abandonment from 40% to under 8%.',
    rating: 5,
  },
  {
    id: 't5',
    name: 'Aisha Patel',
    role: 'Marketing Director',
    company: 'Orion Media Group',
    avatar: 'AP',
    content: 'The scroll-driven storytelling on our new site is phenomenal. Session duration increased 3.4x, and our "contact us" conversion rate doubled. Saino\'s animation work is genuinely world-class — they think in dimensions most agencies don\'t even know exist.',
    rating: 5,
  },
];
