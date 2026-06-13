import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Brain, Code, Palette, Zap, MessageCircle, Sparkles, Send } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import { useMagneticHover } from '@/hooks/useMagneticHover';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { name: 'UI/UX Design', level: 95, icon: Palette },
  { name: 'Three.js / WebGL', level: 90, icon: Code },
  { name: 'GSAP Animation', level: 92, icon: Zap },
  { name: 'AI Integration', level: 88, icon: Brain },
];

// Offline AI response engine (no API needed)
const aiResponses: Record<string, string> = {
  hello: "Hey there! I'm Saino's AI twin. Ask me anything about his work, skills, or process!",
  hi: "👋 Hello! I'm the Saino AI assistant. What would you like to know?",
  experience: "Saino has been crafting digital experiences for over 8 years, working with startups to Fortune 500 companies across fintech, healthcare, e-commerce, and AI.",
  skills: "Saino specializes in WebGL/Three.js 3D development, GSAP animation, AI integration, UI/UX design, and high-performance web architecture.",
  process: "Saino follows a 6-phase process: Discovery → Architecture → Design → Development → Launch → Evolve. Each phase is infused with AI-driven insights.",
  pricing: "Packages start at $2,499 for a Neural Spark landing page, going up to $9,999 for the Cortex Complete ecosystem. Check the Services page for details!",
  portfolio: "You can see Saino's featured work on the Work page — Neural Labs, Quantum Commerce, Axon Finance, and Pulse Health are great case studies.",
  contact: "Head over to the Contact page to start a project! Saino typically responds within 24 hours.",
  default: "That's a great question! I'd recommend checking out the relevant page or reaching out via the Contact form for more specific answers.",
};

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(aiResponses)) {
    if (lower.includes(key)) return response;
  }
  return aiResponses.default;
}

/* ---- AI Chat Avatar Component ---- */
function AIChatAvatar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([
    { role: 'ai', text: aiResponses.hello },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const ctaRef = useMagneticHover<HTMLButtonElement>({ strength: 0.3 });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600));
    const response = getAIResponse(userMsg);

    // Type out response character by character
    let displayed = '';
    for (let i = 0; i < response.length; i++) {
      displayed += response[i];
      if (i % 3 === 0) {
        setMessages((prev) => {
          const newMsgs = [...prev];
          if (newMsgs[newMsgs.length - 1]?.role === 'ai') {
            newMsgs[newMsgs.length - 1] = { role: 'ai', text: displayed };
          } else {
            newMsgs.push({ role: 'ai', text: displayed });
          }
          return newMsgs;
        });
        await new Promise((r) => setTimeout(r, 15 + Math.random() * 20));
      }
    }
    setIsTyping(false);
  };

  const quickReplies = ['What are your skills?', 'Tell me about your process', 'How much does it cost?'];

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {/* Chat window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="absolute bottom-16 right-0 w-80 sm:w-96 glass rounded-2xl border border-glass-border overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-glass-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center">
              <Brain size={16} className="text-deep" />
            </div>
            <div>
              <div className="text-sm font-medium font-display">Saino AI</div>
              <div className="text-xs text-fg-muted flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-success" />
                Online — Ask me anything
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'bg-accent-cyan/10 text-fg-primary border border-accent-cyan/20'
                      : 'glass text-fg-secondary'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="glass rounded-xl px-3 py-2 text-sm text-fg-muted flex gap-1">
                  <span className="animate-pulse">●</span>
                  <span className="animate-pulse delay-75">●</span>
                  <span className="animate-pulse delay-150">●</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {quickReplies.map((q) => (
                <button
                  key={q}
                  onClick={() => setInput(q)}
                  className="px-2.5 py-1 rounded-lg glass text-xs text-fg-muted hover:text-accent-cyan transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-glass-border">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask me anything..."
                className="flex-1 bg-elevated rounded-xl px-3 py-2 text-sm text-fg-primary placeholder:text-fg-muted border border-glass-border focus:outline-none focus:border-accent-cyan/40 transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="w-9 h-9 rounded-xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan hover:bg-accent-cyan/20 disabled:opacity-30 transition-all"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Toggle button */}
      <button
        ref={ctaRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-gradient-to-br from-accent-cyan to-accent-purple flex items-center justify-center text-deep shadow-lg shadow-accent-cyan/20 hover:scale-105 transition-transform"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}

/* ---- About Me Section ---- */
export default function AboutMe() {
  const imageRef = useRef<HTMLDivElement>(null);
  const skillBarsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    // Skill bars animation
    skillBarsRef.current.forEach((bar) => {
      if (!bar) return;
      const level = parseInt(bar.dataset.level || '0');
      gsap.fromTo(
        bar,
        { width: '0%' },
        {
          width: `${level}%`,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: bar,
            start: 'top 90%',
            toggleActions: 'play none none reverse',
          },
        },
      );
    });
  }, []);

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
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium text-accent-cyan mb-4">
            <Sparkles size={14} />
            About
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Meet the Creator
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Avatar / Visual */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            ref={imageRef}
            className="relative"
          >
            <div className="aspect-square max-w-md mx-auto rounded-3xl glass border border-glass-border overflow-hidden relative">
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent-cyan/20 via-accent-purple/20 to-accent-magenta/20 animate-pulse-glow" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-magenta flex items-center justify-center text-4xl font-display font-bold text-deep mb-4">
                    S
                  </div>
                  <h3 className="font-display text-2xl font-bold">Saino</h3>
                  <p className="text-fg-muted text-sm">AI Web Design Studio</p>
                </div>
              </div>
            </div>

            {/* Floating stats */}
            <div className="absolute -bottom-4 -right-4 glass rounded-xl p-4 border border-glass-border">
              <div className="text-2xl font-display font-bold text-gradient"><AnimatedCounter end={8} suffix="+" /></div>
              <div className="text-xs text-fg-muted">Years Experience</div>
            </div>
          </motion.div>

          {/* Bio + Skills */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <p className="text-lg text-fg-secondary leading-relaxed mb-6">
              I'm <span className="text-fg-primary font-semibold">Saino</span> — a designer,
              developer, and AI enthusiast on a mission to redefine what a website can be.
            </p>
            <p className="text-sm text-fg-muted leading-relaxed mb-8">
              With over 8 years of experience spanning startups to Fortune 500 companies,
              I specialize in creating immersive digital experiences that leverage the latest
              in AI, 3D graphics, and animation technology. Every project is an opportunity
              to push boundaries and challenge conventions.
            </p>

            {/* Skills */}
            <div className="space-y-4">
              {skills.map((skill, i) => {
                const Icon = skill.icon;
                return (
                  <div key={skill.name}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2 text-sm text-fg-muted">
                        <Icon size={14} className="text-accent-cyan" />
                        {skill.name}
                      </div>
                      <span className="text-xs font-mono text-fg-muted">{skill.level}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-elevated overflow-hidden">
                      <div
                        ref={(el) => { skillBarsRef.current[i] = el; }}
                        data-level={skill.level}
                        className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple"
                        style={{ width: '0%' }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* AI Chat Avatar - global */}
      <AIChatAvatar />
    </section>
  );
}
